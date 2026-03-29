import { Prisma, VoiceInput } from "@prisma/client";
import { prisma } from "../../core/db/prisma";

export class VoiceRepository {
  async create(data: Prisma.VoiceInputUncheckedCreateInput): Promise<VoiceInput> {
    return prisma.voiceInput.create({
      data
    });
  }
}
