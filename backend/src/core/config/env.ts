import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const parsedRedisUrl = new URL(redisUrl);

function getRequiredEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  PORT: Number(process.env.PORT) || 4000,
  DATABASE_URL: getRequiredEnv("DATABASE_URL", process.env.DATABASE_URL),
  REDIS_URL: redisUrl,
  REDIS_HOST: process.env.REDIS_HOST || parsedRedisUrl.hostname || "localhost",
  REDIS_PORT: Number(process.env.REDIS_PORT || parsedRedisUrl.port || 6379),
  JWT_SECRET: getRequiredEnv("JWT_SECRET", process.env.JWT_SECRET || "dev-only-secret"),
  NLP_SERVICE_URL: process.env.NLP_SERVICE_URL || "http://localhost:8001",
  LOG_LEVEL: process.env.LOG_LEVEL || "info"
};
