export type SendNotificationInput = {
  userId: string;
  devices: Array<{
    id: string;
    platform: string;
    pushToken: string;
  }>;
  title: string;
  body: string;
  data?: Record<string, string>;
};

export interface NotificationSender {
  send(input: SendNotificationInput): Promise<{
    success: boolean;
    deliveredCount: number;
    failedTokens: string[];
  }>;
}
