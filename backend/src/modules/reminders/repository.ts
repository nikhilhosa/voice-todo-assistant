import { prisma } from "../../core/db/prisma"

export class ReminderRepository {

  async create(data:any){
    return prisma.reminder.create({ data })
  }

  async findDueReminders(now:Date){

    return prisma.reminder.findMany({
      where:{
        scheduledAt:{
          lte:now
        },
        status:"pending"
      },
      include:{
        task:true
      }
    })

  }

  async markSent(id:string){

    return prisma.reminder.update({
      where:{ id },
      data:{
        status:"sent",
        sentAt:new Date()
      }
    })

  }

}
