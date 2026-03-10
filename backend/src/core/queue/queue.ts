import { Queue } from "bullmq";

export const voiceQueue = new Queue("voice-processing", {
  connection: {
    host: "127.0.0.1",
    port: 6379
  }
});
