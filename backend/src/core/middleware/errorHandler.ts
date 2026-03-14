import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

export function registerErrorHandler(app: FastifyInstance) {

  app.setErrorHandler((error, request, reply) => {

    request.log.error(error);

    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: "Validation error",
        errors: error.issues
      });
    }

    if (error instanceof Error && error.message === "Invalid OTP") {
      return reply.status(401).send({
        message: "Invalid OTP"
      });
    }

    reply.status(500).send({
      message: "Internal Server Error"
    });

  });

}
