import { ReminderRepository } from "./repository";
import { DeviceRepository } from "../devices/repository";
import { MockNotificationSender } from "../notifications/providers/mock";

export class ReminderEngine {
  private repo = new ReminderRepository();
  private deviceRepo = new DeviceRepository();
  private notificationSender = new MockNotificationSender();

  async run() {
    const reminders = await this.repo.findDueReminders(new Date());

    for (const reminder of reminders) {
      try {
        const title = this.generateTitle(reminder);
        const body = this.generateMessage(reminder);

        const devices = await this.deviceRepo.getActiveDevicesByUserId(
          reminder.task.userId
        );

        if (devices.length === 0) {
          console.warn(
            `No active devices found for user ${reminder.task.userId}. Reminder ${reminder.id} will still be marked sent.`
          );
        } else {
          await this.notificationSender.send({
            userId: reminder.task.userId,
            devices: devices.map((d) => ({
              id: d.id,
              platform: d.platform,
              pushToken: d.pushToken,
            })),
            title,
            body,
            data: {
              reminderId: reminder.id,
              taskId: reminder.taskId,
              reminderType: reminder.type,
            },
          });
        }

        await this.repo.markSent(reminder.id);
      } catch (error) {
        console.error("Failed to process reminder:", reminder.id, error);
        await this.repo.markFailed(reminder.id).catch(() => {});
      }
    }
  }

  generateTitle(reminder: any) {
    if (reminder.type === "prepare") {
      return "Upcoming task";
    }

    if (reminder.type === "main") {
      return "Task reminder";
    }

    if (reminder.type === "followup") {
      return "Task follow-up";
    }

    if (reminder.type === "snooze") {
      return "Snoozed reminder";
    }

    if (reminder.type === "not_now_followup") {
      return "Reminder follow-up";
    }

    return "Reminder";
  }

  generateMessage(reminder: any) {
    const title = reminder.task.title;

    if (reminder.type === "prepare") {
      return `Heads up! "${title}" is coming soon.`;
    }

    if (reminder.type === "main") {
      return `Time to ${title}.`;
    }

    if (reminder.type === "followup") {
      return `Did you manage to ${title}?`;
    }

    if (reminder.type === "snooze") {
      return `Reminder again: ${title}.`;
    }

    if (reminder.type === "not_now_followup") {
      return `Checking back: do you want to ${title} now?`;
    }

    return `Reminder: ${title}.`;
  }
}
