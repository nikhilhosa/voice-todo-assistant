export type TaskPriority = "low" | "medium" | "high";

export interface TaskPayload {
  userId: string;
  title: string;
  description?: string;
  dueDate?: string;
  reminderAt?: string;
  priority?: TaskPriority;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  dueDate?: string;
  reminderAt?: string;
  priority?: TaskPriority;
}
