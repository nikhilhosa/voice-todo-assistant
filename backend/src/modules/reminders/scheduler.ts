import { ReminderRepository } from "./repository"

export class ReminderScheduler {

  private repo = new ReminderRepository()

  async scheduleTaskReminders(task:any){

    if(!task.reminderAt) return

    const reminderTime = new Date(task.reminderAt)

    const prepare = new Date(reminderTime)
    prepare.setMinutes(prepare.getMinutes() - 10)

    const followup = new Date(reminderTime)
    followup.setMinutes(followup.getMinutes() + 5)

    await this.repo.create({
      taskId:task.id,
      type:"prepare",
      scheduledAt:prepare
    })

    await this.repo.create({
      taskId:task.id,
      type:"main",
      scheduledAt:reminderTime
    })

    await this.repo.create({
      taskId:task.id,
      type:"followup",
      scheduledAt:followup
    })

  }

}
