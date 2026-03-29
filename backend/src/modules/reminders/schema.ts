import { z } from "zod";

export const reminderActionParamsSchema = z.object({
  id: z.string().min(1),
});

export const reminderActionBodySchema = z.object({
  action: z.enum(["done", "snooze", "not_now", "ignored"]),
  snoozeMinutes: z.number().int().min(1).max(1440).optional(),
});

export type ReminderActionBody = z.infer<typeof reminderActionBodySchema>;
export type ReminderActionParams = z.infer<typeof reminderActionParamsSchema>;
