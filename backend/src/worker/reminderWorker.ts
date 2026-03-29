import { ReminderEngine } from "../modules/reminders/engine";

const engine = new ReminderEngine();

async function tick() {
  try {
    await engine.run();
  } catch (err) {
    console.error("Reminder engine error:", err);
  }
}

async function start() {
  console.log("Reminder engine started");

  await tick();
  setInterval(tick, 60000);
}

start();
