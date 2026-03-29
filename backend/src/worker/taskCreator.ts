import { prisma } from "../core/db/prisma";
import { scheduleTaskReminders } from "../modules/reminders/scheduler";
import logger from "../utils/logger";

interface CreateTaskInput {
  userId: string;
  title: string;
  dueDate?: Date;
  reminderAt?: Date;
  priority?: "low" | "medium" | "high";
}

export async function createTaskFromVoice(data: CreateTaskInput) {
  const dueDate = data.dueDate ?? data.reminderAt;

  const task = await prisma.task.create({
    data: {
      userId: data.userId,
      title: data.title,
      dueDate,
      reminderAt: data.reminderAt,
      priority: data.priority ?? "medium",
      source: "voice",
      status: "pending"
    }
  });

  logger.info(
    {
      taskId: task.id,
      userId: task.userId,
      title: task.title,
      dueDate: task.dueDate,
      reminderAt: task.reminderAt
    },
    "Task created from voice"
  );

  await scheduleTaskReminders(task.id);

  return task;
}
