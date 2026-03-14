import { prisma } from "../core/db/prisma"

interface CreateTaskInput {
  userId: string
  title: string
  dueDate?: Date
  reminderAt?: Date
  priority?: "low" | "medium" | "high"
}

export async function createTaskFromVoice(data: CreateTaskInput) {

  const task = await prisma.task.create({
    data: {
      userId: data.userId,
      title: data.title,
      dueDate: data.dueDate,
      reminderAt: data.reminderAt,
      priority: data.priority || "medium",
      source: "voice",
      status: "pending"
    }
  })

  console.log("Task created:", task.id)

  return task
}
