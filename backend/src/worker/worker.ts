import { Worker } from "bullmq"
import { redisConnection } from "../core/redis/redis"
import { processVoiceInput } from "./voiceProcessor"

const worker = new Worker(
  "voice-processing",
  processVoiceInput,
  {
    connection: redisConnection,
    concurrency: 5
  }
)

worker.on("completed", job => {
  console.log("Voice job completed:", job.id)
})

worker.on("failed", (job, err) => {
  console.error("Voice job failed:", job?.id, err)
})

console.log("Voice worker started")
