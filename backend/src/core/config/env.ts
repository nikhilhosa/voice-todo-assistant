import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const parsedRedisUrl = new URL(redisUrl);

export const env = {
  PORT: Number(process.env.PORT) || 4000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  REDIS_URL: redisUrl,
  REDIS_HOST: process.env.REDIS_HOST || parsedRedisUrl.hostname || "localhost",
  REDIS_PORT: Number(process.env.REDIS_PORT || parsedRedisUrl.port || 6379),
  JWT_SECRET: process.env.JWT_SECRET || "supersecret",
};
