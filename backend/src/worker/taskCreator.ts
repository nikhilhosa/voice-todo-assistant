import { prisma } from "../core/db/prisma";

export async function createTaskFromVoice(userId:string, title:string, reminderAt?:Date|null){

  return prisma.task.create({
    data:{
      userId,
      title,
      reminderAt: reminderAt || undefined,
      source:"voice"
    }
  });

}
