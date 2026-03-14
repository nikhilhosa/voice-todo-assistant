import axios from "axios"
import { ReminderScheduler } from "../modules/reminders/scheduler"
import { prisma } from "../core/db/prisma"

export async function processVoiceJob(data:any){

  const { voiceId } = data

  const voice = await prisma.voiceInput.findUnique({
    where:{ id: voiceId }
  })

  if(!voice) return

  const response = await axios.post(
    "http://localhost:8001/parse",
    {
      text: voice.text,
      timezone: voice.timezone
    }
  )

  const parsed = response.data

  const intent = parsed.intent
  const title = parsed.title

  if(intent === "create_task"){

    await prisma.task.create({
      data:{
        userId: voice.userId,
        title,
        dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
        reminderAt: parsed.reminderAt ? new Date(parsed.reminderAt) : null,
        source:"voice"
      }
    })

    const scheduler = new ReminderScheduler()

    await scheduler.scheduleTaskReminders(task)

    console.log("Task created")

  }

  if(intent === "complete_task"){

    await prisma.task.updateMany({
      where:{
        userId: voice.userId,
        title:{
          contains:title
        }
      },
      data:{
        status:"completed",
        completedAt:new Date()
      }
    })

    console.log("Task completed")

  }

  if(intent === "delete_task"){

    await prisma.task.updateMany({
      where:{
        userId: voice.userId,
        title:{
          contains:title
        }
      },
      data:{
        deletedAt:new Date()
      }
    })

    console.log("Task deleted")

  }

  if(intent === "update_task"){

    await prisma.task.updateMany({
      where:{
        userId: voice.userId,
        title:{
          contains:title
        }
      },
      data:{
        dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
        reminderAt: parsed.reminderAt ? new Date(parsed.reminderAt) : null
      }
    })

    console.log("Task updated")

  }

  await prisma.voiceInput.update({
    where:{ id: voiceId },
    data:{ status:"processed" }
  })

}
