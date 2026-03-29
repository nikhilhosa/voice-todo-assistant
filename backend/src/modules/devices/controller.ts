import { FastifyReply, FastifyRequest } from "fastify";
import { DeviceService } from "./service";
import { deviceParamsSchema, registerDeviceBodySchema } from "./schema";

export class DeviceController {
  private service = new DeviceService();

  async register(request: FastifyRequest, reply: FastifyReply) {
    const body = registerDeviceBodySchema.parse(request.body);

    const result = await this.service.registerDevice({
      userId: request.user.id,
      platform: body.platform,
      pushToken: body.pushToken,
    });

    return reply.send(result);
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const result = await this.service.listDevices(request.user.id);
    return reply.send(result);
  }

  async remove(request: FastifyRequest, reply: FastifyReply) {
    const params = deviceParamsSchema.parse(request.params);

    const result = await this.service.removeDevice(request.user.id, params.id);
    return reply.send(result);
  }
}
