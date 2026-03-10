import Fastify from "fastify";
import authPlugin from "./core/plugins/auth";
import rateLimitPlugin from "./core/plugins/rateLimit";
import { registerRoutes } from "./routes";
import { registerErrorHandler } from "./core/middleware/errorHandler";

export async function buildApp() {
  const app = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
      },
    },
  });

  await app.register(authPlugin);
  await app.register(rateLimitPlugin);

  registerErrorHandler(app);

  await registerRoutes(app);

  return app;
}
