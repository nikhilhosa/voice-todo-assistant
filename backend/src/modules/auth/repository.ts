import { prisma } from "../../core/db/prisma";

export class AuthRepository {

  async findUserByPhone(phone: string) {
    return prisma.user.findUnique({ where: { phone } });
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(data:any) {
    return prisma.user.create({ data });
  }
}
