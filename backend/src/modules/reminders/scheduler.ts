import { PrismaClient } from "@prisma/client";
import logger from "../../utils/logger";

const prisma = new PrismaClient();

export async function scheduleTaskReminders(taskId: string): Promise<void> {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task?.reminderAt) {
      logger.warn(`No reminderAt for task ${taskId}, skipping scheduling`);
      return;
    }

    const reminderAt = new Date(task.reminderAt);
    if (isNaN(reminderAt.getTime())) {
      logger.error(`Invalid reminderAt for task ${taskId}: ${task.reminderAt}`);
      return;
    }

    await prisma.reminder.deleteMany({ where: { taskId } });

    const reminders = [
      { type: "prepare", scheduledAt: new Date(reminderAt.getTime() - 5 * 60 * 1000) },
      { type: "main", scheduledAt: reminderAt },
      { type: "followup", scheduledAt: new Date(reminderAt.getTime() + 5 * 60 * 1000) }
    ];

    await prisma.reminder.createMany({
      data: reminders.map((reminder) => ({
        taskId,
        type: reminder.type,
        scheduledAt: reminder.scheduledAt.toISOString(),
        status: "pending"
      }))
    });

    logger.info(`Scheduled ${reminders.length} reminders for task ${taskId}`);
  } catch (error) {
    logger.error({ error }, `Failed to schedule reminders for task ${taskId}`);
  }
}
