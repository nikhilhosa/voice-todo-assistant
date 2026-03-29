import { ReminderEngine } from "../modules/reminders/engine";
import logger from "../utils/logger";

const engine = new ReminderEngine();
const intervalMs = 60_000;

async function runCycle() {
  try {
    await engine.run();
  } catch (err) {
    logger.error({ err }, "Reminder engine cycle failed");
  }
}

async function start() {
  logger.info("Reminder engine started");
  await runCycle();
  setInterval(runCycle, intervalMs);
}

void start();
