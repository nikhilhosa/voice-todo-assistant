import { prisma } from "../../core/db/prisma";

export class VoiceRepository {

  async create(data:any){
    return prisma.voiceInput.create({ data });
  }

}
