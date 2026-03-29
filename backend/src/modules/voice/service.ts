import { VoiceInput } from "@prisma/client";
import { voiceQueue } from "../../core/queue/queue";
import { VoiceRepository } from "./repository";

interface CreateVoiceInput {
  userId: string;
  text: string;
  language?: string;
  timezone?: string;
}

export class VoiceService {
  private repo: VoiceRepository;

  constructor() {
    this.repo = new VoiceRepository();
  }

  async handleVoiceInput(data: CreateVoiceInput): Promise<VoiceInput> {
    const voice = await this.repo.create(data);

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
        removeOnComplete: true,
        removeOnFail: 100
      }
    );

    return voice;
  }
}
