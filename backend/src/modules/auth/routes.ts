import { FastifyInstance } from "fastify";
import { AuthController } from "./controller";

export async function authRoutes(app:FastifyInstance){

  const controller = new AuthController();

  app.post("/auth/otp/request", controller.requestOtp.bind(controller));

  app.post("/auth/otp/verify", controller.verifyOtp.bind(controller));
}
