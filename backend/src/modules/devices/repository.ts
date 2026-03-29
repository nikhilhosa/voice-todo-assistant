import { prisma } from "../../core/db/prisma";

export class DeviceRepository {
  async upsertDevice(input: {
    userId: string;
    platform: string;
    pushToken: string;
  }) {
    const existing = await prisma.device.findUnique({
      where: {
        pushToken: input.pushToken,
      },
    });

    if (existing) {
      return prisma.device.update({
        where: { id: existing.id },
        data: {
          userId: input.userId,
          platform: input.platform,
          isActive: true,
        },
      });
    }

    return prisma.device.create({
      data: {
        userId: input.userId,
        platform: input.platform,
        pushToken: input.pushToken,
        isActive: true,
      },
    });
  }

  async listUserDevices(userId: string) {
    return prisma.device.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findUserDeviceById(userId: string, id: string) {
    return prisma.device.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async deactivateDevice(userId: string, id: string) {
    return prisma.device.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        isActive: false,
      },
    });
  }

  async getActiveDevicesByUserId(userId: string) {
    return prisma.device.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async deactivateByPushToken(pushToken: string) {
    return prisma.device.updateMany({
      where: {
        pushToken,
      },
      data: {
        isActive: false,
      },
    });
  }
}
