import { prisma } from "../../core/db/prisma";

export class ReminderRepository {
  async findDueReminders(now: Date) {
    try {
      return await prisma.reminder.findMany({
        where: {
          status: "pending",
          scheduledAt: {
            lte: now,
          },
        },
        include: {
          task: true,
        },
        orderBy: {
          scheduledAt: "asc",
        },
      });
    } catch (error) {
      console.error("Reminder query failed:", error);
      return [];
    }
  }

  async markSent(reminderId: string) {
    return prisma.reminder.update({
      where: { id: reminderId },
      data: {
        status: "sent",
        sentAt: new Date(),
      },
    });
  }

  async markFailed(reminderId: string) {
    return prisma.reminder.update({
      where: { id: reminderId },
      data: {
        status: "failed",
      },
    });
  }

  async findReminderForUser(reminderId: string, userId: string) {
    return prisma.reminder.findFirst({
      where: {
        id: reminderId,
        task: {
          userId,
          deletedAt: null,
        },
      },
      include: {
        task: true,
        actions: true,
      },
    });
  }

  async createAction(data: {
    reminderId: string;
    taskId: string;
    action: string;
    metadata?: string | null;
  }) {
    return prisma.reminderAction.create({
      data,
    });
  }

  async markActedOn(reminderId: string, status: string = "acted_on") {
    return prisma.reminder.update({
      where: { id: reminderId },
      data: {
        status,
      },
    });
  }

  async completeTask(taskId: string) {
    return prisma.task.update({
      where: { id: taskId },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    });
  }

  async cancelPendingTaskReminders(taskId: string, excludeReminderId?: string) {
    return prisma.reminder.updateMany({
      where: {
        taskId,
        status: "pending",
        ...(excludeReminderId
          ? {
              id: {
                not: excludeReminderId,
              },
            }
          : {}),
      },
      data: {
        status: "cancelled",
      },
    });
  }

  async createReminder(data: {
    taskId: string;
    type: string;
    scheduledAt: Date;
    status?: string;
  }) {
    return prisma.reminder.create({
      data: {
        taskId: data.taskId,
        type: data.type,
        scheduledAt: data.scheduledAt,
        status: data.status ?? "pending",
      },
    });
  }

  async updateTaskReminderAt(taskId: string, reminderAt: Date) {
    return prisma.task.update({
      where: { id: taskId },
      data: {
        reminderAt,
      },
    });
  }
}
