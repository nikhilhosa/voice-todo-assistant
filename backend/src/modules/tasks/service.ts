import { Prisma } from "@prisma/client";
import { scheduleTaskReminders } from "../reminders/scheduler";
import { ReminderRepository } from "../reminders/repository";
import { TaskRepository } from "./repository";
import { TaskPayload, UpdateTaskPayload } from "./types";

export class TaskService {
  private repo = new TaskRepository();
  private reminderRepo = new ReminderRepository();

  async createTask(data: TaskPayload) {
    this.validateDates(data.dueDate, data.reminderAt);

    const createData: Prisma.TaskUncheckedCreateInput = {
      userId: data.userId,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      reminderAt: data.reminderAt ? new Date(data.reminderAt) : undefined,
      priority: data.priority || "medium"
    };

    const task = await this.repo.create(createData);

    if (task.reminderAt) {
      await scheduleTaskReminders(task.id);
    }

    return task;
  }

  async getTasks(userId: string) {
    return this.repo.findAll(userId);
  }

  async updateTask(id: string, userId: string, data: UpdateTaskPayload) {
    await this.repo.assertOwnership(id, userId);
    this.validateDates(data.dueDate, data.reminderAt);

    const updateData: Prisma.TaskUncheckedUpdateInput = {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : data.dueDate === undefined ? undefined : null,
      reminderAt: data.reminderAt ? new Date(data.reminderAt) : data.reminderAt === undefined ? undefined : null,
      priority: data.priority
    };

    const task = await this.repo.update(id, userId, updateData);

    if (task.reminderAt) {
      await scheduleTaskReminders(task.id);
    } else {
      await this.reminderRepo.deleteByTaskId(task.id);
    }

    return task;
  }

  async deleteTask(id: string, userId: string) {
    await this.reminderRepo.deleteByTaskId(id);
    return this.repo.softDelete(id, userId);
  }

  async completeTask(id: string, userId: string) {
    await this.reminderRepo.deleteByTaskId(id);
    return this.repo.complete(id, userId);
  }

  private validateDates(dueDate?: string, reminderAt?: string) {
    if (dueDate) {
      const due = new Date(dueDate);
      if (isNaN(due.getTime()) || due < new Date()) {
        throw new Error("Due date cannot be in the past");
      }
    }

    if (reminderAt) {
      const reminder = new Date(reminderAt);
      if (isNaN(reminder.getTime()) || reminder < new Date()) {
        throw new Error("Due date cannot be in the past");
      }
    }
  }
}
