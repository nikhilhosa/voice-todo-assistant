import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { env } from "../config/env";

export default fp(async (app) => {
  app.register(jwt, {
    secret: env.JWT_SECRET,
  });

  app.decorate("authenticate", async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  });
});
