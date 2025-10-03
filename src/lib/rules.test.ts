import { describe, it, expect } from 'vitest';
import { canSendFromAccountPure, isWithinQuietHours } from './rules';
import { TelegramAccount } from '@/types';

function makeAccount(overrides: Partial<TelegramAccount> = {}): TelegramAccount {
  return {
    id: 'acc-test',
    handle: 'tester',
    displayName: 'Tester',
    status: 'connected',
    dailyLimit: 10,
    sentToday: 0,
    settings: {
      delaySeconds: 60,
      activeTemplateId: null,
      activePromptId: null,
      respectQuietHours: true,
      lastSentAt: undefined,
    },
    ...overrides,
  } as TelegramAccount;
}

describe('isWithinQuietHours', () => {
  it('returns false when quiet hours not respected', () => {
    expect(isWithinQuietHours(false, new Date('2025-01-01T23:00:00Z'))).toBe(false);
  });
});

describe('canSendFromAccountPure', () => {
  it('disallows when disconnected', () => {
    const acc = makeAccount({ status: 'disconnected' });
    expect(canSendFromAccountPure(acc)).toBe(false);
  });

  it('disallows when at daily limit', () => {
    const acc = makeAccount({ sentToday: 10, dailyLimit: 10 });
    expect(canSendFromAccountPure(acc)).toBe(false);
  });

  it('disallows during quiet hours when respected', () => {
    const acc = makeAccount({ settings: { ...makeAccount().settings, respectQuietHours: true } });
    const now = new Date('2025-01-01T23:00:00');
    expect(canSendFromAccountPure(acc, now)).toBe(false);
  });

  it('allows outside quiet hours with no last send', () => {
    const acc = makeAccount({ settings: { ...makeAccount().settings, respectQuietHours: true } });
    const now = new Date('2025-01-01T12:00:00');
    expect(canSendFromAccountPure(acc, now)).toBe(true);
  });

  it('disallows when delay since last send not met', () => {
    const now = new Date('2025-01-01T12:01:00');
    const last = new Date('2025-01-01T12:00:30'); // 30s ago
    const acc = makeAccount({ settings: { ...makeAccount().settings, delaySeconds: 60, lastSentAt: last as any } });
    expect(canSendFromAccountPure(acc, now)).toBe(false);
  });

  it('allows when delay since last send met', () => {
    const now = new Date('2025-01-01T12:02:01');
    const last = new Date('2025-01-01T12:00:30'); // 91s ago
    const acc = makeAccount({ settings: { ...makeAccount().settings, delaySeconds: 60, lastSentAt: last as any } });
    expect(canSendFromAccountPure(acc, now)).toBe(true);
  });
});


