import { prisma } from "../../core/db/prisma";

export class ReminderRepository {
  async findDueReminders(now: Date) {
    try {
      return await prisma.reminder.findMany({
        where: {
          status: "pending",
          scheduledAt: { lte: now },
          task: {
            deletedAt: null,
            status: "pending"
          }
        },
        include: {
          task: true
        },
        orderBy: {
          scheduledAt: "asc"
        }
      });
    } catch (error) {
      console.error("Reminder query failed:", error);
      return [];
    }
  }

  async markSent(id: string) {
    return prisma.reminder.update({
      where: { id },
      data: {
        status: "sent",
        sentAt: new Date()
      }
    });
  }

  async deleteByTaskId(taskId: string) {
    return prisma.reminder.deleteMany({
      where: { taskId }
    });
  }
}
