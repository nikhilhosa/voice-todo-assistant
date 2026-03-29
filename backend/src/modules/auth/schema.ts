import { z } from "zod";

const identitySchema = z
  .object({
    phone: z.string().min(8).max(20).optional(),
    email: z.string().email().optional()
  })
  .refine((data) => Boolean(data.phone || data.email), {
    message: "Either phone or email is required"
  });

export const requestOtpSchema = identitySchema;

export const verifyOtpSchema = identitySchema.extend({
  otp: z.string().length(6)
});
