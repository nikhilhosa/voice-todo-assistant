import { prisma } from "../core/db/prisma";
import logger from "../utils/logger";
import { parseVoiceText } from "./dateParser";
import { createTaskFromVoice } from "./taskCreator";

interface VoiceJobData {
  voiceInputId: string;
}

export async function processVoiceInput(job: { data: VoiceJobData }) {
  const { voiceInputId } = job.data;

  const voiceInput = await prisma.voiceInput.findUnique({
    where: { id: voiceInputId }
  });

  if (!voiceInput) {
    throw new Error(`Voice input not found: ${voiceInputId}`);
  }

  const parsed = parseVoiceText(voiceInput.text);

  logger.info(
    {
      voiceInputId,
      parsedTitle: parsed.title,
      parsedReminderAt: parsed.reminderAt
    },
    "Voice text parsed"
  );

  const task = await createTaskFromVoice({
    userId: voiceInput.userId,
    title: parsed.title,
    dueDate: parsed.reminderAt,
    reminderAt: parsed.reminderAt,
    priority: "medium"
  });

  await prisma.voiceInput.update({
    where: { id: voiceInputId },
    data: {
      status: "processed"
    }
  });

  logger.info(
    {
      voiceInputId,
      taskId: task.id
    },
    "Voice input processed successfully"
  );
}
