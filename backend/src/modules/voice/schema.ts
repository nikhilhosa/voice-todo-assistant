import { z } from "zod";

export const voiceInputSchema = z.object({
  text: z.string().min(2).max(500),
  language: z.string().optional()
});
