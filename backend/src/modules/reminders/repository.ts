import { prisma } from "../../core/db/prisma"

export class ReminderRepository {

  async findDueReminders(now: Date) {

    try {

      return await prisma.reminder.findMany({
        where: {
          status: "pending",
          scheduledAt: {
            lte: now
          }
        },
        include: {
          task: true
        }
      })

    } catch (error) {

      console.error("Reminder query failed:", error)

      return []

    }

  }

}
