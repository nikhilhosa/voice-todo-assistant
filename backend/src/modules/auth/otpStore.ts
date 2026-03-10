const otpStore = new Map<string, { otp: string; expires: number }>();

export function saveOtp(key: string, otp: string) {
  otpStore.set(key, {
    otp,
    expires: Date.now() + 5 * 60 * 1000
  });
}

export function verifyOtp(key: string, otp: string) {
  const data = otpStore.get(key);

  if (!data) return false;
  if (Date.now() > data.expires) return false;

  return data.otp === otp;
}
