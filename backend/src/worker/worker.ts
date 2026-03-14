
import { Worker } from "bullmq";
import axios from "axios";
import { prisma } from "../core/db/prisma";
import { createTaskFromVoice } from "./taskCreator";


const worker = new Worker(
  "voice-processing",
  async (job) => {

    const { voiceId } = job.data;

    const voice = await prisma.voiceInput.findUnique({
      where: { id: voiceId }
    });

    if (!voice) return;

    // Call Python NLP service
    const response = await axios.post(
      "http://localhost:8001/parse",
      { text: voice.text }
    );

    const parsed = response.data;

    await createTaskFromVoice({
      userId: voice.userId,
      title: parsed.title,
      reminderAt: parsed.datetime
    });

    await prisma.voiceInput.update({
      where: { id: voiceId },
      data: { status: "processed" }
    });
    console.log("Parsed NLP result:", parsed)
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
