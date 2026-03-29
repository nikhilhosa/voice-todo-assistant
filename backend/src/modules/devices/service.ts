import { DeviceRepository } from "./repository";

export class DeviceService {
  private repo = new DeviceRepository();

  async registerDevice(input: {
    userId: string;
    platform: "android" | "ios" | "web";
    pushToken: string;
  }) {
    const device = await this.repo.upsertDevice(input);

    return {
      success: true,
      message: "Device registered successfully",
      device,
    };
  }

  async listDevices(userId: string) {
    const devices = await this.repo.listUserDevices(userId);

    return {
      success: true,
      devices,
    };
  }

  async removeDevice(userId: string, id: string) {
    const existing = await this.repo.findUserDeviceById(userId, id);

    if (!existing) {
      throw new Error("Device not found");
    }

    await this.repo.deactivateDevice(userId, id);

    return {
      success: true,
      message: "Device deactivated successfully",
    };
  }
}
