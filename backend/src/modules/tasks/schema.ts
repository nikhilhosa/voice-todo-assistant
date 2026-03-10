import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().max(500).optional(),
  dueDate: z.string().datetime().optional(),
  reminderAt: z.string().datetime().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
