import { saveOtp, verifyOtp as verifyStoredOtp } from "./otpStore";
import { AuthRepository } from "./repository";

export class AuthService {
  private repo = new AuthRepository();

  async requestOtp(phone?: string, email?: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = phone || email;

    if (!key) {
      throw new Error("Either phone or email is required");
    }

    await saveOtp(key, otp);

    console.log("OTP:", otp);

    return { message: "OTP sent" };
  }

  async verifyOtp(phone?: string, email?: string, otp?: string) {
    const key = phone || email;

    if (!key || !otp) {
      throw new Error("Invalid OTP");
    }

    const valid = await verifyStoredOtp(key, otp);

    if (!valid) {
      throw new Error("Invalid OTP");
    }

    if (phone) {
      const existing = await this.repo.findUserByPhone(phone);
      return existing ?? this.repo.createUser({ phone });
    }

    if (email) {
      const existing = await this.repo.findUserByEmail(email);
      return existing ?? this.repo.createUser({ email });
    }

    throw new Error("Invalid OTP");
  }
}
