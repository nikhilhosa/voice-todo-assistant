import { FastifyInstance } from "fastify";
import { HealthController } from "./controller";

export async function healthRoutes(app: FastifyInstance) {
  const controller = new HealthController();

  app.get("/health", controller.check);
}
