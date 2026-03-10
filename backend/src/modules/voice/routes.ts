import { FastifyInstance } from "fastify";
import { VoiceController } from "./controller";

export async function voiceRoutes(app:FastifyInstance){

  const controller = new VoiceController();

  app.post(
    "/v1/voice-input",
    { preHandler:[app.authenticate] },
    controller.create.bind(controller)
  );

}
