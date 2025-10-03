import { store } from './store';
import { updateMessageStatus } from './slices/messagesSlice';
import { incrementSentCount, incrementFailedCount } from './slices/campaignsSlice';
import { incrementSentToday } from './slices/accountsSlice';
import { TelegramAccount } from '@/types';

// Check if current time is within quiet hours (22:00 - 08:00)
const isWithinQuietHours = (respectQuietHours: boolean): boolean => {
  if (!respectQuietHours) return false;
  const hour = new Date().getHours();
  return hour >= 22 || hour < 8;
};

// Check if an account can send a message
const canSendFromAccount = (account: TelegramAccount): boolean => {
  // Account must be connected
  if (account.status !== 'connected') return false;
  
  // Must be under daily limit
  if (account.sentToday >= account.dailyLimit) return false;
  
  // Check quiet hours
  if (isWithinQuietHours(account.settings.respectQuietHours)) return false;
  
  // Check delay since last send
  if (account.settings.lastSentAt) {
    const elapsed = Date.now() - new Date(account.settings.lastSentAt).getTime();
    if (elapsed < account.settings.delaySeconds * 1000) return false;
  }
  
  return true;
};

// Process the message queue
export const processMessageQueue = () => {
  const state = store.getState();
  const campaigns = state.campaigns;
  const accounts = state.accounts;
  const messages = state.messages;
  
  // Get running campaigns
  const runningCampaigns = campaigns.items.filter(c => c.status === 'running');
  if (runningCampaigns.length === 0) return;
  
  // For each running campaign
  for (const campaign of runningCampaigns) {
    // For each account in the campaign
    for (const accountId of campaign.accountIds) {
      const account = accounts.items.find(a => a.id === accountId);
      if (!account || !canSendFromAccount(account)) continue;
      
      // Find first queued message for this campaign + account
      const queuedMessage = messages.items.find(
        m => m.campaignId === campaign.id && 
             m.accountId === accountId && 
             m.status === 'queued'
      );
      
      if (!queuedMessage) continue;
      
      // Move to sending
      store.dispatch(updateMessageStatus({
        id: queuedMessage.id,
        status: 'sending',
      }));
      
      // Simulate network send with random delay
      const sendDelay = 400 + Math.random() * 800;
      
      setTimeout(() => {
        // 10% chance of failure
        const failed = Math.random() < 0.1;
        
        if (failed) {
          // Mark as failed
          store.dispatch(updateMessageStatus({
            id: queuedMessage.id,
            status: 'failed',
            errorMessage: 'Rate limit exceeded',
          }));
          store.dispatch(incrementFailedCount(campaign.id));
        } else {
          // Mark as sent
          store.dispatch(updateMessageStatus({
            id: queuedMessage.id,
            status: 'sent',
            sentAt: new Date(),
          }));
          store.dispatch(incrementSentCount(campaign.id));
          store.dispatch(incrementSentToday(accountId));
        }
      }, sendDelay);
    }
  }
};

// Start the queue processor
let queueProcessorInterval: NodeJS.Timeout | null = null;

export const startQueueProcessor = () => {
  if (queueProcessorInterval) return;
  
  // Process every second
  queueProcessorInterval = setInterval(() => {
    processMessageQueue();
  }, 1000);
};

export const stopQueueProcessor = () => {
  if (queueProcessorInterval) {
    clearInterval(queueProcessorInterval);
    queueProcessorInterval = null;
  }
};

