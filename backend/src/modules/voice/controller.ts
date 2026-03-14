import { FastifyReply, FastifyRequest } from "fastify"
import { VoiceService } from "./service"

export class VoiceController {

  private service: VoiceService

  constructor() {
    this.service = new VoiceService()
  }

  async createVoiceInput(request: FastifyRequest, reply: FastifyReply) {

    const userId = (request as any).user.id
    const { text, language, timezone } = request.body as any

    const voice = await this.service.handleVoiceInput({
      userId,
      text,
      language: language || "en",
      timezone: timezone || "UTC"
    })

    return reply.send(voice)
  }

}
