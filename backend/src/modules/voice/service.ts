import { VoiceRepository } from "./repository"
import { voiceQueue } from "../../core/queue/queue"

export class VoiceService {

  private repo: VoiceRepository

  constructor() {
    this.repo = new VoiceRepository()
  }

  async handleVoiceInput(data: any) {

    const voice = await this.repo.create(data)

    await voiceQueue.add(
      "process-voice",
      {
        voiceInputId: voice.id
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000
        },
        removeOnComplete: true
      }
    )

    return voice
  }

}
