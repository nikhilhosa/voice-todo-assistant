import { FastifyInstance } from "fastify";
import { DeviceController } from "./controller";

export async function deviceRoutes(app: FastifyInstance) {
  const controller = new DeviceController();

  app.post(
    "/v1/devices/register",
    {
      preHandler: [app.authenticate],
    },
    controller.register.bind(controller)
  );

  app.get(
    "/v1/devices",
    {
      preHandler: [app.authenticate],
    },
    controller.list.bind(controller)
  );

  app.delete(
    "/v1/devices/:id",
    {
      preHandler: [app.authenticate],
    },
    controller.remove.bind(controller)
  );
}
