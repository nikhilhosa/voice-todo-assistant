import { ReminderRepository } from "./repository"

export class ReminderEngine {

  private repo = new ReminderRepository()

  async run(){

    const reminders = await this.repo.findDueReminders(new Date())

    for(const reminder of reminders){

      const message = this.generateMessage(reminder)

      console.log("SEND NOTIFICATION:",message)

      await this.repo.markSent(reminder.id)

    }

  }

  generateMessage(reminder:any){

    const title = reminder.task.title

    if(reminder.type === "prepare"){
      return `Heads up! "${title}" in 10 minutes.`
    }

    if(reminder.type === "main"){
      return `Time to ${title}.`
    }

    if(reminder.type === "followup"){
      return `Did you manage to ${title}?`
    }

  }

}
