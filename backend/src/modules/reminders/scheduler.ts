import logger from "../../utils/logger";
import { prisma } from "../../core/db/prisma";

export async function scheduleTaskReminders(taskId: string): Promise<void> {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      logger.warn({ taskId }, "Task not found, skipping reminder scheduling");
      return;
    }

    if (!task.reminderAt) {
      logger.warn({ taskId }, "No reminderAt found, deleting old reminders and skipping scheduling");
      await prisma.reminder.deleteMany({ where: { taskId } });
      return;
    }

    const reminderAt = new Date(task.reminderAt);

    if (isNaN(reminderAt.getTime())) {
      logger.error(
        { taskId, reminderAt: task.reminderAt },
        "Invalid reminderAt, skipping reminder scheduling"
      );
      return;
    }

    await prisma.reminder.deleteMany({ where: { taskId } });

    const now = Date.now();

    const candidateReminders = [
      {
        type: "prepare",
        scheduledAt: new Date(reminderAt.getTime() - 5 * 60 * 1000)
      },
      {
        type: "main",
        scheduledAt: reminderAt
      },
      {
        type: "followup",
        scheduledAt: new Date(reminderAt.getTime() + 5 * 60 * 1000)
      }
    ];

    const remindersToCreate = candidateReminders.filter(
      (reminder) => reminder.scheduledAt.getTime() > now
    );

    if (remindersToCreate.length === 0) {
      logger.warn(
        { taskId, reminderAt },
        "All reminder times are in the past, skipping reminder creation"
      );
      return;
    }

    await prisma.reminder.createMany({
      data: remindersToCreate.map((reminder) => ({
        taskId,
        type: reminder.type,
        scheduledAt: reminder.scheduledAt,
        status: "pending"
      }))
    });

    logger.info(
      {
        taskId,
        reminderCount: remindersToCreate.length,
        reminders: remindersToCreate
      },
      "Task reminders scheduled"
    );
  } catch (error) {
    logger.error({ error, taskId }, "Failed to schedule task reminders");
    throw error;
  }
}
