import { FastifyInstance } from "fastify";

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    reply.status(500).send({
      message: "Internal Server Error",
    });
  });
}
