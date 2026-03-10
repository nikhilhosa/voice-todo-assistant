import { buildApp } from "./app";
import { env } from "./core/config/env";

async function start() {
  const app = await buildApp();

  try {
    await app.listen({ port: env.PORT });
    console.log(`Server running on port ${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
