import { VoiceRepository } from "./repository";
import { voiceQueue } from "../../core/queue/queue";

export class VoiceService {

  private repo = new VoiceRepository();

  async handleVoiceInput(data:any){

    const voice = await this.repo.create(data);

    await voiceQueue.add("process-voice", {
      voiceId: voice.id
    });

    return voice;
  }

}
