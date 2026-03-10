import { prisma } from "../core/db/prisma";
import { parseVoice } from "./parser";

export async function processVoice(voiceId:string){

  const voice = await prisma.voiceInput.findUnique({
    where:{ id: voiceId }
  });

  if(!voice) return;

  const parsed = parseVoice(voice.text);

  await prisma.task.create({
    data:{
      userId: voice.userId,
      title: parsed.title,
      dueDate: parsed.dueDate,
      reminderAt: parsed.reminderAt,
      source:"voice"
    }
  });

  await prisma.voiceInput.update({
    where:{ id: voiceId },
    data:{ status:"processed" }
  });

}
