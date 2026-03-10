export interface TaskPayload {
  userId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  reminderAt?: Date;
  priority?: "low" | "medium" | "high";
}
