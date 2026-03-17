import { saveOtp, verifyOtp } from "./otpStore";
import { AuthRepository } from "./repository";

export class AuthService {

  private repo = new AuthRepository();

  async requestOtp(phone?: string, email?: string) {

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const key = phone || email!;

    await saveOtp(key, otp);

    console.log("OTP:", otp);

    return { message: "OTP sent" };
  }

  async verifyOtp(phone?: string, email?: string, otp?: string) {

    const key = phone || email!;

    const valid = await verifyOtp(key, otp!);

    if (!valid) {
      throw new Error("Invalid OTP");
    }

    let user;

    if (phone) {
      user = await this.repo.findUserByPhone(phone);
      if (!user) user = await this.repo.createUser({ phone });
    }

    if (email) {
      user = await this.repo.findUserByEmail(email);
      if (!user) user = await this.repo.createUser({ email });
    }

    return user;
  }
}
