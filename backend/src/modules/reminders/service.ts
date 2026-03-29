import { ReminderRepository } from "./repository";

type ReminderActionType = "done" | "snooze" | "not_now" | "ignored";

export class ReminderService {
  private repo = new ReminderRepository();

  async actOnReminder(input: {
    reminderId: string;
    userId: string;
    action: ReminderActionType;
    snoozeMinutes?: number;
  }) {
    const reminder = await this.repo.findReminderForUser(input.reminderId, input.userId);

    if (!reminder) {
      throw new Error("Reminder not found");
    }

    const metadata =
      input.action === "snooze"
        ? JSON.stringify({
            snoozeMinutes: input.snoozeMinutes ?? 10,
          })
        : null;

    await this.repo.createAction({
      reminderId: reminder.id,
      taskId: reminder.taskId,
      action: input.action,
      metadata,
    });

    if (input.action === "done") {
      await this.repo.completeTask(reminder.taskId);
      await this.repo.markActedOn(reminder.id, "done");
      await this.repo.cancelPendingTaskReminders(reminder.taskId);

      return {
        success: true,
        action: input.action,
        taskId: reminder.taskId,
        reminderId: reminder.id,
        message: "Task marked as completed and future reminders cancelled.",
      };
    }

    if (input.action === "snooze") {
      const snoozeMinutes = input.snoozeMinutes ?? 10;
      const nextTime = new Date(Date.now() + snoozeMinutes * 60 * 1000);

      await this.repo.markActedOn(reminder.id, "snoozed");
      await this.repo.cancelPendingTaskReminders(reminder.taskId);

      const newReminder = await this.repo.createReminder({
        taskId: reminder.taskId,
        type: "snooze",
        scheduledAt: nextTime,
        status: "pending",
      });

      await this.repo.updateTaskReminderAt(reminder.taskId, nextTime);

      return {
        success: true,
        action: input.action,
        taskId: reminder.taskId,
        reminderId: reminder.id,
        newReminderId: newReminder.id,
        scheduledAt: nextTime.toISOString(),
        message: `Reminder snoozed for ${snoozeMinutes} minutes.`,
      };
    }

    if (input.action === "not_now") {
      const nextTime = new Date(Date.now() + 15 * 60 * 1000);

      await this.repo.markActedOn(reminder.id, "not_now");
      await this.repo.cancelPendingTaskReminders(reminder.taskId);

      const newReminder = await this.repo.createReminder({
        taskId: reminder.taskId,
        type: "not_now_followup",
        scheduledAt: nextTime,
        status: "pending",
      });

      await this.repo.updateTaskReminderAt(reminder.taskId, nextTime);

      return {
        success: true,
        action: input.action,
        taskId: reminder.taskId,
        reminderId: reminder.id,
        newReminderId: newReminder.id,
        scheduledAt: nextTime.toISOString(),
        message: "Okay, I’ll remind you again shortly.",
      };
    }

    await this.repo.markActedOn(reminder.id, "ignored");

    return {
      success: true,
      action: input.action,
      taskId: reminder.taskId,
      reminderId: reminder.id,
      message: "Reminder marked as ignored.",
    };
  }
}
