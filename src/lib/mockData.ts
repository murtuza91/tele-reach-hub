import { TelegramAccount, CopyTemplate, AIPrompt, Campaign, OutreachMessage } from "@/types";

export const mockAccounts: TelegramAccount[] = [
  {
    id: "acc-1",
    handle: "john_outreach",
    displayName: "John Smith",
    status: "connected",
    dailyLimit: 50,
    sentToday: 23,
    settings: {
      delaySeconds: 300,
      activeTemplateId: "tpl-1",
      activePromptId: "prm-1",
      respectQuietHours: true,
      lastSentAt: new Date(Date.now() - 3600000),
    },
  },
  {
    id: "acc-2",
    handle: "sarah_connect",
    displayName: "Sarah Johnson",
    status: "connected",
    dailyLimit: 75,
    sentToday: 48,
    settings: {
      delaySeconds: 180,
      activeTemplateId: "tpl-2",
      activePromptId: "prm-1",
      respectQuietHours: true,
      lastSentAt: new Date(Date.now() - 1800000),
    },
  },
  {
    id: "acc-3",
    handle: "mike_growth",
    displayName: "Mike Chen",
    status: "rate-limited",
    dailyLimit: 100,
    sentToday: 100,
    settings: {
      delaySeconds: 240,
      activeTemplateId: "tpl-1",
      activePromptId: "prm-2",
      respectQuietHours: false,
      lastSentAt: new Date(Date.now() - 900000),
    },
  },
];

export const mockTemplates: CopyTemplate[] = [
  {
    id: "tpl-1",
    title: "SaaS Outreach Template",
    body: "Hi {{firstName}},\n\nI noticed {{company}} is in the {{industry}} space. We help companies like yours increase conversion by 30% with our automation platform.\n\nInterested in a quick demo?\n\nBest,\n{{senderName}}",
    isActive: true,
    isDefault: true,
    createdAt: new Date("2025-01-15").toISOString(),
  },
  {
    id: "tpl-2",
    title: "Partnership Proposal",
    body: "Hello {{firstName}},\n\nI'm reaching out from {{senderCompany}} about a potential partnership opportunity with {{company}}.\n\nWould you have 15 minutes this week to discuss?\n\nThanks,\n{{senderName}}",
    isActive: true,
    isDefault: false,
    createdAt: new Date("2025-01-20").toISOString(),
  },
  {
    id: "tpl-3",
    title: "Content Collaboration",
    body: "Hey {{firstName}},\n\nLove what you're doing at {{company}}! Would you be interested in collaborating on content?\n\nLet me know!\n{{senderName}}",
    isActive: false,
    isDefault: false,
    createdAt: new Date("2025-01-10").toISOString(),
  },
];

export const mockPrompts: AIPrompt[] = [
  {
    id: "prm-1",
    title: "Personalization Pro",
    systemPrompt: "Enhance the outreach message by adding personalized touches based on the recipient's company and role. Keep it professional and concise. Maintain the core message but make it feel authentic and tailored.",
    isActive: true,
    isDefault: true,
    createdAt: new Date("2025-01-15").toISOString(),
  },
  {
    id: "prm-2",
    title: "Casual & Friendly",
    systemPrompt: "Rewrite the message to sound more casual and friendly, like you're reaching out to a peer. Use conversational language while keeping it professional enough for business.",
    isActive: true,
    isDefault: false,
    createdAt: new Date("2025-01-18").toISOString(),
  },
];

export const mockCampaigns: Campaign[] = [
  {
    id: "cmp-1",
    name: "Q1 SaaS Founder Outreach",
    status: "running",
    accountIds: ["acc-1", "acc-2"],
    templateId: "tpl-1",
    promptId: "prm-1",
    targetCount: 200,
    sentCount: 87,
    failedCount: 3,
    queuedCount: 110,
    createdAt: new Date("2025-02-01").toISOString(),
    startedAt: new Date("2025-02-02").toISOString(),
    endedAt: undefined,
  },
  {
    id: "cmp-2",
    name: "Partnership Outreach - Tech Companies",
    status: "paused",
    accountIds: ["acc-2", "acc-3"],
    templateId: "tpl-2",
    promptId: "prm-1",
    targetCount: 150,
    sentCount: 42,
    failedCount: 1,
    queuedCount: 107,
    createdAt: new Date("2025-01-25").toISOString(),
    startedAt: new Date("2025-01-26").toISOString(),
    endedAt: undefined,
  },
];

export const mockMessages: OutreachMessage[] = Array.from({ length: 50 }, (_, i) => ({
  id: `msg-${i + 1}`,
  campaignId: i < 30 ? "cmp-1" : "cmp-2",
  accountId: ["acc-1", "acc-2", "acc-3"][i % 3],
  recipientName: `Contact ${i + 1}`,
  recipientCompany: `Company ${i + 1}`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  status: (["sent", "queued", "sending", "failed"][i % 4]) as any,
  scheduledFor: new Date(Date.now() + i * 300000),
  sentAt: i % 4 === 0 ? new Date(Date.now() - i * 60000) : null,
  errorMessage: i % 4 === 3 ? "Rate limit exceeded" : null,
}));
