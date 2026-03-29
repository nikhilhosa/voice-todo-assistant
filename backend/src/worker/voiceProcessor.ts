import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { Job } from "bullmq";
import { z } from "zod";
import logger from "../utils/logger";

const prisma = new PrismaClient();
const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || "http://localhost:8001";

const NlpResponseSchema = z.object({
  intent: z.enum([
    "create_task",
    "complete_task",
    "delete_task",
    "update_task",
    "unknown",
  ]),
  title: z.string().min(1).max(200),
  targetTitle: z.string().min(1).max(200).nullable().optional(),
  dueDate: z.string().nullable().optional(),
  reminderAt: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

type ParsedNlp = z.infer<typeof NlpResponseSchema>;
type VoiceInputRecord = Awaited<ReturnType<typeof prisma.voiceInput.findUnique>>;

export async function processVoiceInput(job: Job): Promise<void> {
  const { voiceInputId } = job.data as { voiceInputId: string };

  let voiceInput: VoiceInputRecord;

  try {
    voiceInput = await prisma.voiceInput.findUnique({
      where: { id: voiceInputId },
    });

    if (!voiceInput) {
      throw new Error(`VoiceInput ${voiceInputId} not found`);
    }

    if (voiceInput.status === "processed") {
      logger.warn(`VoiceInput ${voiceInputId} already processed, skipping`);
      return;
    }

    logger.info(`Processing voice: "${voiceInput.text}" (ID: ${voiceInputId})`);

    const response = await axios.post(`${NLP_SERVICE_URL}/parse`, {
      text: voiceInput.text,
      timezone: voiceInput.timezone || "UTC",
      language: voiceInput.language || "en",
    });

    const parsed = NlpResponseSchema.parse(response.data);

    logger.info(
      `Parsed NLP intent=${parsed.intent} title="${parsed.title}" dueDate=${parsed.dueDate ?? "null"}`
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
      case "update_task":
        await handleUpdateTask(voiceInput, parsed);
        break;
      case "unknown":
      default:
        logger.warn(`Unknown voice intent for VoiceInput ${voiceInputId}`);
        break;
    }

    await prisma.voiceInput.update({
      where: { id: voiceInputId },
      data: { status: "processed" },
    });

    logger.info(`VoiceInput ${voiceInputId} processed successfully`);
  } catch (error) {
    logger.error({ err: error }, `VoiceInput ${voiceInputId} processing failed`);

    await prisma.voiceInput
      .update({
        where: { id: voiceInputId },
        data: { status: "failed" },
      })
      .catch(() => {});

    throw error;
  }
}

async function handleCreateTask(
  voiceInput: NonNullable<VoiceInputRecord>,
  parsed: ParsedNlp
) {
  const dueDate = parsed.dueDate ? new Date(parsed.dueDate) : null;
  const reminderAt = parsed.reminderAt ? new Date(parsed.reminderAt) : dueDate;

  const safeTitle = parsed.title.trim();
  if (!safeTitle || safeTitle.length < 2) {
    logger.warn(`Skipping create_task because title is invalid: "${parsed.title}"`);
    return;
  }

  const task = await prisma.task.create({
    data: {
      userId: voiceInput.userId,
      title: safeTitle,
      description: parsed.description ?? voiceInput.text,
      dueDate,
      reminderAt,
      source: "voice",
      status: "pending",
      priority: "medium",
    },
  });

  logger.info(`Task created: ${task.id}`);

  if (reminderAt && !isNaN(reminderAt.getTime())) {
    const { scheduleTaskReminders } = await import("../modules/reminders/scheduler");
    await scheduleTaskReminders(task.id);
    logger.info(`Reminders scheduled for task: ${task.id}`);
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
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  if (!tasks[0]) {
    logger.warn(`No matching pending task found to complete: ${parsed.title}`);
    return;
  }

  const updated = await prisma.task.update({
    where: { id: tasks[0].id },
    data: {
      status: "completed",
      completedAt: new Date(),
    },
  });

  await prisma.reminder.updateMany({
    where: {
      taskId: updated.id,
      status: "pending",
    },
    data: {
      status: "cancelled",
    },
  });

  logger.info(`Task completed: ${updated.id}`);
}

async function handleDeleteTask(
  voiceInput: NonNullable<VoiceInputRecord>,
  parsed: ParsedNlp
) {
  const tasks = await prisma.task.findMany({
    where: {
      userId: voiceInput.userId,
      title: { contains: parsed.title, mode: "insensitive" },
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  if (!tasks[0]) {
    logger.warn(`No matching task found to delete: ${parsed.title}`);
    return;
  }

  const updated = await prisma.task.update({
    where: { id: tasks[0].id },
    data: {
      deletedAt: new Date(),
      status: "deleted",
    },
  });

  await prisma.reminder.updateMany({
    where: {
      taskId: updated.id,
      status: "pending",
    },
    data: {
      status: "cancelled",
    },
  });

  logger.info(`Task soft-deleted: ${updated.id}`);
}

async function handleUpdateTask(
  voiceInput: NonNullable<VoiceInputRecord>,
  parsed: ParsedNlp
) {
  const targetTitle = parsed.targetTitle || parsed.title;

  const tasks = await prisma.task.findMany({
    where: {
      userId: voiceInput.userId,
      title: { contains: targetTitle, mode: "insensitive" },
      status: "pending",
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  if (!tasks[0]) {
    logger.warn(`No matching pending task for update: ${targetTitle}`);
    return;
  }

  const dueDate = parsed.dueDate ? new Date(parsed.dueDate) : null;
  const reminderAt = parsed.reminderAt ? new Date(parsed.reminderAt) : dueDate;

  const updated = await prisma.task.update({
    where: { id: tasks[0].id },
    data: {
      dueDate,
      reminderAt,
    },
  });

  logger.info(`Task updated: ${updated.id}`);

  if (reminderAt && !isNaN(reminderAt.getTime())) {
    const { scheduleTaskReminders } = await import("../modules/reminders/scheduler");
    await scheduleTaskReminders(updated.id);
    logger.info(`Reminders re-scheduled for task: ${updated.id}`);
  }
}
