import { FastifyReply, FastifyRequest } from "fastify";
import { ReminderService } from "./service";
import {
  reminderActionBodySchema,
  reminderActionParamsSchema,
} from "./schema";

export class ReminderController {
  private service = new ReminderService();

  async actOnReminder(request: FastifyRequest, reply: FastifyReply) {
    const params = reminderActionParamsSchema.parse(request.params);
    const body = reminderActionBodySchema.parse(request.body);

    const result = await this.service.actOnReminder({
      reminderId: params.id,
      userId: request.user.id,
      action: body.action,
      snoozeMinutes: body.snoozeMinutes,
    });

    return reply.send(result);
  }
}
