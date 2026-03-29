import { FastifyInstance } from "fastify";
import { authRoutes } from "./modules/auth/routes";
import { taskRoutes } from "./modules/tasks/routes";
import { voiceRoutes } from "./modules/voice/routes";
import { healthRoutes } from "./modules/health/routes";
import { reminderRoutes } from "./modules/reminders/routes";
import { deviceRoutes } from "./modules/devices/routes";

export async function registerRoutes(app: FastifyInstance) {
  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(taskRoutes);
  await app.register(voiceRoutes);
  await app.register(reminderRoutes);
  await app.register(deviceRoutes);
}
