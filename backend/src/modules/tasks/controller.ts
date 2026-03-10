import { FastifyReply, FastifyRequest } from "fastify";
import { TaskService } from "./service";
import { createTaskSchema, updateTaskSchema } from "./schema";

export class TaskController {
  private service = new TaskService();

  async create(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user as { id: string };
    const body = createTaskSchema.parse(req.body);

    const task = await this.service.createTask({
      userId: user.id,
      ...body,
    });

    return reply.status(201).send(task);
  }

  async list(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user as { id: string };

    const tasks = await this.service.getTasks(user.id);

    return reply.send(tasks);
  }

  async update(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user as { id: string };
    const { id } = req.params as any;

    const body = updateTaskSchema.parse(req.body);

    await this.service.updateTask(id, user.id, body);

    return reply.send({ message: "Task updated" });
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user as { id: string };
    const { id } = req.params as any;

    await this.service.deleteTask(id, user.id);

    return reply.send({ message: "Task deleted" });
  }

  async complete(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user as { id: string };
    const { id } = req.params as any;

    await this.service.completeTask(id, user.id);

    return reply.send({ message: "Task completed" });
  }
}
