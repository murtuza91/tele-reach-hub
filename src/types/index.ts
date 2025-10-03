export type AccountStatus = "connected" | "rate-limited" | "disconnected";

export interface TelegramAccount {
  id: string;
  handle: string;
  displayName: string;
  status: AccountStatus;
  dailyLimit: number;
  sentToday: number;
  settings: AccountSettings;
}

export interface AccountSettings {
  delaySeconds: number;
  dailyLimit: number;
  activeCopySetId: string | null;
  activePromptId: string | null;
  respectQuietHours: boolean;
  lastSentAt: Date | null;
}

export interface CopyTemplate {
  id: string;
  title: string;
  body: string;
  isActive: boolean;
  createdAt: Date;
}

export interface AIPrompt {
  id: string;
  title: string;
  systemPrompt: string;
  isActive: boolean;
  createdAt: Date;
}

export type CampaignStatus = "draft" | "running" | "paused" | "completed" | "cancelled";

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  accountIds: string[];
  templateId: string;
  promptId: string;
  targetCount: number;
  sentCount: number;
  failedCount: number;
  queuedCount: number;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
}

export type MessageStatus = "queued" | "sending" | "sent" | "failed";

export interface OutreachMessage {
  id: string;
  campaignId: string;
  accountId: string;
  recipientName: string;
  recipientCompany: string;
  status: MessageStatus;
  scheduledFor: Date;
  sentAt: Date | null;
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
