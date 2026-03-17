import { ReminderEngine } from "../modules/reminders/engine"

const engine = new ReminderEngine()

async function start() {

  console.log("Reminder engine started")

  setInterval(async () => {

    try {

      await engine.run()

    } catch (err) {

      console.error("Reminder engine error:", err)

    }

  }, 60000)

}

start()
