import { ReminderEngine } from "../modules/reminders/engine"

const engine = new ReminderEngine()

setInterval(async ()=>{

  await engine.run()

},60000)

