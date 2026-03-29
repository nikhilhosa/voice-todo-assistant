import { FastifyInstance } from "fastify";
import { VoiceController } from "./controller";
import { voiceInputSchema } from "./schema";

export async function voiceRoutes(app: FastifyInstance) {
  const controller = new VoiceController();

  app.post(
    "/v1/voice-input",
    {
      preHandler: [app.authenticate],
      schema: {
        body: voiceInputSchema
      }
    },
    controller.createVoiceInput.bind(controller)
  );
}
