import { redis } from "../../core/redis/redis";

const OTP_TTL = 300; // 5 minutes

export async function saveOtp(key: string, otp: string) {
  await redis.set(`otp:${key}`, otp, "EX", OTP_TTL);
}

export async function verifyOtp(key: string, otp: string) {
  const stored = await redis.get(`otp:${key}`);

  if (!stored) return false;

  return stored === otp;
}
