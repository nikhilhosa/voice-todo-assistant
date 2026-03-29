import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error }, "Unhandled request error");

    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: "Validation error",
        errors: error.issues
      });
    }

    if (error instanceof Error) {
      if (error.message === "Invalid OTP") {
        return reply.status(401).send({ message: "Invalid OTP" });
      }

      if (error.message === "Due date cannot be in the past") {
        return reply.status(400).send({ message: error.message });
      }

      if (error.message === "Task not found") {
        return reply.status(404).send({ message: error.message });
      }
    }

    return reply.status(500).send({
      message: "Internal Server Error"
    });
  });
}
