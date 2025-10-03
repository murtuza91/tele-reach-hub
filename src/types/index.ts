export type AccountStatus = "connected" | "rate-limited" | "disconnected";

export interface TelegramAccount {
  id: string;
  handle: string;
  displayName: string;
  phoneNumber?: string;
  status: AccountStatus;
  dailyLimit: number;
  sentToday: number;
  settings: AccountSettings;
}

export interface AccountSettings {
  delaySeconds: number;
  activeTemplateId: string | null;
  activePromptId: string | null;
  respectQuietHours: boolean;
  lastSentAt?: Date;
}

export interface CopyTemplate {
  id: string;
  title: string;
  body: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
}

export interface AIPrompt {
  id: string;
  title: string;
  systemPrompt: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
}

export type CampaignStatus = "draft" | "running" | "paused" | "completed" | "cancelled";

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  templateId: string;
  promptId?: string;
  accountIds: string[];
  targetCount: number;
  sentCount: number;
  queuedCount: number;
  failedCount: number;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
}

export type MessageStatus = "queued" | "sending" | "sent" | "failed";

export interface OutreachMessage {
  id: string;
  campaignId: string;
  accountId: string;
  recipientName: string;
  recipientCompany: string;
  status: MessageStatus;
  scheduledFor: Date | string;
  sentAt: Date | string | null;
  errorMessage: string | null;
}

export interface DashboardStats {
  messagesToday: number;
  messagesThisWeek: number;
  messagesThisMonth: number;
  activeAccounts: number;
  activeCampaigns: number;
  queuedMessages: number;
}

export interface AccountStats {
  accountId: string;
  sent: number;
  failed: number;
  avgResponseDelay: number;
}

export interface CampaignStats {
  campaignId: string;
  sent: number;
  failed: number;
  replies: number;
}
