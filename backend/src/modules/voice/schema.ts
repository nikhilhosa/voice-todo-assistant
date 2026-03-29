import { z } from "zod"

export const voiceInputZod = z.object({
  text: z.string().min(2).max(500),
  language: z.string().optional(),
  timezone: z.string().optional()
})

export const voiceInputSchema = {
  type: "object",
  required: ["text"],
  properties: {
    text: { type: "string", minLength: 2, maxLength: 500 },
    language: { type: "string" },
    timezone: { type: "string" }
  },
  additionalProperties: false
} as const


