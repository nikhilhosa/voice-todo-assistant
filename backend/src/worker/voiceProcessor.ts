import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { Job } from "bullmq";
import { z } from "zod";
import logger from "../utils/logger";

const prisma = new PrismaClient();
const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || "http://localhost:8001";

const NlpResponseSchema = z.object({
  intent: z.enum(["create_task", "complete_task", "delete_task", "unknown"]),
  title: z.string().min(1).max(200),
  dueDate: z.string().nullable().optional(),
  reminderAt: z.string().nullable().optional(),
  description: z.string().nullable().optional()
});

type ParsedNlp = z.infer<typeof NlpResponseSchema>;
type VoiceInputRecord = Awaited<ReturnType<typeof prisma.voiceInput.findUnique>>;

export async function processVoiceInput(job: Job): Promise<void> {
  const { voiceInputId } = job.data as { voiceInputId: string };

  let voiceInput: VoiceInputRecord;

  try {
    voiceInput = await prisma.voiceInput.findUnique({
      where: { id: voiceInputId }
    });

    if (!voiceInput) {
      throw new Error(`VoiceInput ${voiceInputId} not found`);
    }

    logger.info(`Processing voice: "${voiceInput.text}" (ID: ${voiceInputId})`);

    const nlpResponse = await axios.post(
      `${NLP_SERVICE_URL}/parse`,
      {
        text: voiceInput.text,
        timezone: voiceInput.timezone || "UTC",
        language: voiceInput.language || "en"
      },
      { timeout: 5000 }
    );

    const parsed = NlpResponseSchema.parse(nlpResponse.data);
    logger.info(
      {
        intent: parsed.intent,
        title: parsed.title,
        dueDate: parsed.dueDate,
        reminderAt: parsed.reminderAt
      },
      "NLP Result"
    );

    switch (parsed.intent) {
      case "create_task":
        await handleCreateTask(voiceInput, parsed);
        break;
      case "complete_task":
        await handleCompleteTask(voiceInput, parsed);
        break;
      case "delete_task":
        await handleDeleteTask(voiceInput, parsed);
        break;
      default:
        logger.warn(`Unknown intent: ${parsed.intent}`);
    }

    await prisma.voiceInput.update({
      where: { id: voiceInputId },
      data: { status: "processed" }
    });

    logger.info(`Voice processing completed: ${voiceInputId}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error({ error: message }, `Voice processing failed (${voiceInputId})`);

    await prisma.voiceInput.update({
      where: { id: voiceInputId },
      data: { status: "failed" }
    });

    throw error;
  }
}

async function handleCreateTask(
  voiceInput: NonNullable<VoiceInputRecord>,
  parsed: ParsedNlp
) {
  const dueDate = parsed.dueDate ? new Date(parsed.dueDate) : null;
  const reminderAt = parsed.reminderAt ? new Date(parsed.reminderAt) : null;

  if (dueDate && isNaN(dueDate.getTime())) {
    logger.warn("Invalid dueDate, creating task without reminders");
  }

  logger.info(`Creating task: "${parsed.title}"`);

  const task = await prisma.task.create({
    data: {
      userId: voiceInput.userId,
      title: parsed.title,
      description: parsed.description || undefined,
      dueDate: dueDate?.toISOString() || null,
      reminderAt: reminderAt?.toISOString() || null,
      source: "voice",
      status: "pending"
    }
  });

  logger.info(`Task created: ID ${task.id}`);

  if (reminderAt && !isNaN(reminderAt.getTime())) {
    logger.info(`Scheduling reminders for task ${task.id}`);
    const { scheduleTaskReminders } = await import("../modules/reminders/scheduler");
    await scheduleTaskReminders(task.id);
  }
}

async function handleCompleteTask(
  voiceInput: NonNullable<VoiceInputRecord>,
  parsed: ParsedNlp
) {
  const tasks = await prisma.task.findMany({
    where: {
      userId: voiceInput.userId,
      title: { contains: parsed.title, mode: "insensitive" },
      status: "pending",
      deletedAt: null
    },
    take: 1
  });

  if (tasks[0]) {
    await prisma.task.update({
      where: { id: tasks[0].id },
      data: {
        status: "completed",
        completedAt: new Date().toISOString()
      }
    });
    logger.info(`Completed task: ${tasks[0].id}`);
  } else {
    logger.warn(`No matching pending task for completion: ${parsed.title}`);
  }
}

async function handleDeleteTask(
  voiceInput: NonNullable<VoiceInputRecord>,
  parsed: ParsedNlp
) {
  const tasks = await prisma.task.findMany({
    where: {
      userId: voiceInput.userId,
      title: { contains: parsed.title, mode: "insensitive" },
      deletedAt: null
    },
    take: 1
  });

  if (tasks[0]) {
    await prisma.task.update({
      where: { id: tasks[0].id },
      data: { deletedAt: new Date().toISOString() }
    });
    logger.info(`Deleted task: ${tasks[0].id}`);
  }
}
