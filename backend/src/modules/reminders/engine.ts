import { Reminder, Task } from "@prisma/client";
import { ReminderRepository } from "./repository";

type ReminderWithTask = Reminder & { task: Task };

export class ReminderEngine {
  private repo = new ReminderRepository();

  async run() {
    const reminders = await this.repo.findDueReminders(new Date());

    for (const reminder of reminders) {
      const message = this.generateMessage(reminder);

      console.log("SEND NOTIFICATION:", message);

      await this.repo.markSent(reminder.id);
    }
  }

  generateMessage(reminder: ReminderWithTask): string {
    const title = reminder.task.title;

    if (reminder.type === "prepare") {
      return `Heads up! \"${title}\" is coming up soon.`;
    }

    if (reminder.type === "main") {
      return `Time to ${title}.`;
    }

    if (reminder.type === "followup") {
      return `Did you manage to ${title}?`;
    }

    return `Reminder: ${title}`;
  }
}
