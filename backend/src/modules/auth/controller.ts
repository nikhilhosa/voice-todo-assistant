import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./service";
import { requestOtpSchema, verifyOtpSchema } from "./schema";

export class AuthController {

  private service = new AuthService();

  async requestOtp(req:FastifyRequest, reply:FastifyReply) {

    const body = requestOtpSchema.parse(req.body);

    const res = this.service.requestOtp(body.phone, body.email);

    return reply.send(res);
  }

  async verifyOtp(req:FastifyRequest, reply:FastifyReply) {

    const body = verifyOtpSchema.parse(req.body);

    const user = await this.service.verifyOtp(body.phone, body.email, body.otp);
    if (!user) {
      throw new Error("Invalid OTP");
    }

    const token = req.server.jwt.sign({
      id: user.id
    });

    return reply.send({
      token,
      user
    });
  }
}
