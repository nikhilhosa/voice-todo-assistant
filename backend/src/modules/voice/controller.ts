import { FastifyReply, FastifyRequest } from "fastify"
import { VoiceService } from "./service"
import { voiceInputZod } from "./schema"

export class VoiceController {

  private service: VoiceService

  constructor() {
    this.service = new VoiceService()
  }

  async createVoiceInput(request: FastifyRequest, reply: FastifyReply) {

    const userId = request.user.id
    const { text, language, timezone } = voiceInputZod.parse(request.body)

    const voice = await this.service.handleVoiceInput({
      userId,
      text,
      language: language || "en",
      timezone: timezone || "UTC"
    })

    return reply.send(voice)
  }

}


