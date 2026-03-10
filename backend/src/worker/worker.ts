import { Worker } from "bullmq";
import { prisma } from "../core/db/prisma";

import { parseVoiceText } from "./parser";
import { parseDate } from "./dateParser";
import { createTaskFromVoice } from "./taskCreator";

const worker = new Worker(
  "voice-processing",
  async (job) => {

    const { voiceId } = job.data;

    const voice = await prisma.voiceInput.findUnique({
      where: { id: voiceId }
    });

    if (!voice) return;

    const parsed = parseVoiceText(voice.text);
    const reminder = parseDate(voice.text);

    await createTaskFromVoice(
      voice.userId,
      parsed.title,
      reminder
    );

    await prisma.voiceInput.update({
      where: { id: voiceId },
      data: { status: "processed" }
    });

    console.log("Voice job processed:", voiceId);

  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379
    }
  }
);

console.log("Worker listening for voice jobs...");
