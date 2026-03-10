import { z } from "zod";

export const requestOtpSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional()
});

export const verifyOtpSchema = z.object({
  phone: z.string().optional(),
  email: z.string().optional(),
  otp: z.string().length(6)
});
