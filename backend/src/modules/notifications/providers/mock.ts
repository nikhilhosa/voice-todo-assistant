import {
  NotificationSender,
  SendNotificationInput,
} from "../service";

export class MockNotificationSender implements NotificationSender {
  async send(input: SendNotificationInput) {
    console.log("MOCK PUSH SEND:", {
      userId: input.userId,
      title: input.title,
      body: input.body,
      data: input.data,
      deviceCount: input.devices.length,
      devices: input.devices.map((d) => ({
        id: d.id,
        platform: d.platform,
        pushToken: d.pushToken,
      })),
    });

    return {
      success: true,
      deliveredCount: input.devices.length,
      failedTokens: [],
    };
  }
}
