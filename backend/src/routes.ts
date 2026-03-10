import { FastifyInstance } from "fastify";
import { healthRoutes } from "./modules/health/routes";
import { taskRoutes } from "./modules/tasks/routes";
import { authRoutes } from "./modules/auth/routes";
import { voiceRoutes } from "./modules/voice/routes";

export async function registerRoutes(app) {
  await healthRoutes(app);
  await taskRoutes(app);
  await authRoutes(app);
  await voiceRoutes(app);
}

