import { FastifyReply, FastifyRequest } from "fastify";
import { VoiceService } from "./service";
import { voiceInputSchema } from "./schema";

export class VoiceController {

  private service = new VoiceService();

  async create(req:FastifyRequest, reply:FastifyReply){

    const user = req.user as { id:string };

    const body = voiceInputSchema.parse(req.body);

    const voice = await this.service.handleVoiceInput({
      userId: user.id,
      text: body.text,
      language: body.language || "en"
    });

    return reply.send({
      message:"Voice input received",
      id: voice.id
    });

  }

}
