import { Queue } from "bullmq"
import { redisConnection } from "../redis/redis"

export const voiceQueue = new Queue(
  "voice-processing",
  {
    connection: redisConnection
  }
)
