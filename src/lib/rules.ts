import { TelegramAccount } from '@/types';

export function isWithinQuietHours(respectQuietHours: boolean, now: Date = new Date()): boolean {
  if (!respectQuietHours) return false;
  const hour = now.getHours();
  return hour >= 22 || hour < 8;
}

export function canSendFromAccountPure(account: TelegramAccount, now: Date = new Date()): boolean {
  if (account.status !== 'connected') return false;
  if (account.sentToday >= account.dailyLimit) return false;
  if (isWithinQuietHours(account.settings.respectQuietHours, now)) return false;
  const last = account.settings.lastSentAt ? new Date(account.settings.lastSentAt as any) : undefined;
  if (last) {
    const elapsedMs = now.getTime() - last.getTime();
    if (elapsedMs < account.settings.delaySeconds * 1000) return false;
  }
  return true;
}


