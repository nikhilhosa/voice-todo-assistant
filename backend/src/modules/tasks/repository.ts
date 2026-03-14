import { prisma } from "../../core/db/prisma";

export class TaskRepository {

  async create(data: any) {
    return prisma.task.create({ data });
  }

  async findAll(userId: string) {
    return prisma.task.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string, userId: string) {
    return prisma.task.findFirst({
      where: { id, userId, deletedAt: null },
    });
  }

  async update(id: string, userId: string, data: any) {
    return prisma.task.updateMany({
      where: { id, userId },
      data
    });
  }

  async softDelete(id: string, userId: string) {
    return prisma.task.updateMany({
      where: { id, userId },
      data: { deletedAt: new Date() },
    });
  }

  async complete(id: string, userId: string) {
    return prisma.task.updateMany({
      where: { id, userId },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    });
  }

}
