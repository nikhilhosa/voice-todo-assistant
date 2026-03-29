import { FastifyInstance } from "fastify";
import { TaskController } from "./controller";

export async function taskRoutes(app: FastifyInstance) {

  const controller = new TaskController();

  app.post(
    "/v1/tasks",
    { preHandler: [app.authenticate] },
    controller.create.bind(controller)
  );

  app.get(
    "/v1/tasks",
    { preHandler: [app.authenticate] },
    controller.list.bind(controller)
  );

  app.put(
    "/v1/tasks/:id",
    { preHandler: [app.authenticate] },
    controller.update.bind(controller)
  );

  app.delete(
    "/v1/tasks/:id",
    { preHandler: [app.authenticate] },
    controller.delete.bind(controller)
  );

  app.patch(
    "/v1/tasks/:id/complete",
    { preHandler: [app.authenticate] },
    controller.complete.bind(controller)
  );
}


