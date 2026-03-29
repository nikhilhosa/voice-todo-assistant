import { Prisma, Task } from "@prisma/client";
import { prisma } from "../../core/db/prisma";

export class TaskRepository {
  async create(data: Prisma.TaskUncheckedCreateInput): Promise<Task> {
    return prisma.task.create({ data });
  }

  async findAll(userId: string) {
    return prisma.task.findMany({
      where: {
        userId,
        deletedAt: null
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async findById(id: string, userId: string) {
    return prisma.task.findFirst({
      where: { id, userId, deletedAt: null }
    });
  }

  async update(id: string, userId: string, data: Prisma.TaskUncheckedUpdateInput) {
    return prisma.task.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string, userId: string) {
    await this.assertOwnership(id, userId);
    return prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async complete(id: string, userId: string) {
    await this.assertOwnership(id, userId);
    return prisma.task.update({
      where: { id },
      data: {
        status: "completed",
        completedAt: new Date()
      }
    });
  }

  async assertOwnership(id: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: { id, userId, deletedAt: null }
    });

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }
}
