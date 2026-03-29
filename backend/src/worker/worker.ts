import { Worker } from "bullmq";
import { redisConnection } from "../core/redis/redis";
import logger from "../utils/logger";
import { processVoiceInput } from "./voiceProcessor";

const worker = new Worker("voice-processing", processVoiceInput, {
  connection: redisConnection,
  concurrency: 5
});

worker.on("ready", () => {
  logger.info("Voice worker is ready");
});

worker.on("completed", (job) => {
  logger.info({ jobId: job.id }, "Voice job completed");
});

worker.on("failed", (job, err) => {
  logger.error(
    {
      err,
      jobId: job?.id,
      attemptsMade: job?.attemptsMade
    },
    "Voice job failed"
  );
});

worker.on("error", (err) => {
  logger.error({ err }, "Voice worker error");
});

logger.info("Voice worker started");
