import { FastifyInstance } from "fastify";
import { ReminderController } from "./controller";

export async function reminderRoutes(app: FastifyInstance) {
  const controller = new ReminderController();

  app.post(
    "/v1/reminders/:id/action",
    {
      preHandler: [app.authenticate],
    },
    controller.actOnReminder.bind(controller)
  );
}
