import { z } from "zod";

export const registerDeviceBodySchema = z.object({
  platform: z.enum(["android", "ios", "web"]),
  pushToken: z.string().min(10).max(1000),
});

export const deviceParamsSchema = z.object({
  id: z.string().min(1),
});

export type RegisterDeviceBody = z.infer<typeof registerDeviceBodySchema>;
export type DeviceParams = z.infer<typeof deviceParamsSchema>;
