import { TaskRepository } from "./repository";

export class TaskService {
  private repo = new TaskRepository();

  async createTask(data: any) {
    if (data.dueDate && new Date(data.dueDate) < new Date()) {
      throw new Error("Due date cannot be in the past");
    }

    return this.repo.create(data);
  }

  async getTasks(userId: string) {
    return this.repo.findAll(userId);
  }

  async updateTask(id: string, userId: string, data: any) {
    return this.repo.update(id, userId, data);
  }

  async deleteTask(id: string, userId: string) {
    return this.repo.softDelete(id, userId);
  }

  async completeTask(id: string, userId: string) {
    return this.repo.complete(id, userId);
  }
}
