import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

export const voiceInputZod = z.object({
  text: z.string().min(2).max(500),
  language: z.string().optional(),
  timezone: z.string().optional()
})

export const voiceInputSchema = zodToJsonSchema(voiceInputZod)
