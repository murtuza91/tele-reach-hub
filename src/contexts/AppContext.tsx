import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  TelegramAccount,
  CopyTemplate,
  AIPrompt,
  Campaign,
  OutreachMessage,
  MessageStatus,
  CampaignStatus,
} from '@/types';
import {
  mockAccounts as initialAccounts,
  mockTemplates as initialTemplates,
  mockPrompts as initialPrompts,
  mockCampaigns as initialCampaigns,
  mockMessages as initialMessages,
} from '@/lib/mockData';

interface AppContextType {
  accounts: TelegramAccount[];
  templates: CopyTemplate[];
  prompts: AIPrompt[];
  campaigns: Campaign[];
  messages: OutreachMessage[];
  addMessage: (message: Omit<OutreachMessage, 'id'>) => void;
  updateMessage: (id: string, updates: Partial<OutreachMessage>) => void;
  
  // Accounts
  addAccount: (account: Omit<TelegramAccount, 'id'>) => void;
  updateAccount: (id: string, account: Partial<TelegramAccount>) => void;
  deleteAccount: (id: string) => void;
  
  // Templates
  addTemplate: (template: Omit<CopyTemplate, 'id' | 'createdAt'>) => void;
  updateTemplate: (id: string, template: Partial<CopyTemplate>) => void;
  deleteTemplate: (id: string) => void;
  
  // Prompts
  addPrompt: (prompt: Omit<AIPrompt, 'id' | 'createdAt'>) => void;
  updatePrompt: (id: string, prompt: Partial<AIPrompt>) => void;
  deletePrompt: (id: string) => void;
  
  // Campaigns
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt'>) => void;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  startCampaign: (id: string) => void;
  pauseCampaign: (id: string) => void;
  resumeCampaign: (id: string) => void;
  cancelCampaign: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<TelegramAccount[]>(() => {
    const stored = localStorage.getItem('trh_accounts');
    return stored ? JSON.parse(stored) : initialAccounts;
  });
  const [templates, setTemplates] = useState<CopyTemplate[]>(() => {
    const stored = localStorage.getItem('trh_templates');
    return stored ? JSON.parse(stored) : initialTemplates;
  });
  const [prompts, setPrompts] = useState<AIPrompt[]>(() => {
    const stored = localStorage.getItem('trh_prompts');
    return stored ? JSON.parse(stored) : initialPrompts;
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const stored = localStorage.getItem('trh_campaigns');
    return stored ? JSON.parse(stored) : initialCampaigns;
  });
  const [messages, setMessages] = useState<OutreachMessage[]>(() => {
    const stored = localStorage.getItem('trh_messages');
    return stored ? JSON.parse(stored) : initialMessages;
  });

  // persist
  useEffect(() => { localStorage.setItem('trh_accounts', JSON.stringify(accounts)); }, [accounts]);
  useEffect(() => { localStorage.setItem('trh_templates', JSON.stringify(templates)); }, [templates]);
  useEffect(() => { localStorage.setItem('trh_prompts', JSON.stringify(prompts)); }, [prompts]);
  useEffect(() => { localStorage.setItem('trh_campaigns', JSON.stringify(campaigns)); }, [campaigns]);
  useEffect(() => { localStorage.setItem('trh_messages', JSON.stringify(messages)); }, [messages]);

  // Accounts
  const addAccount = useCallback((account: Omit<TelegramAccount, 'id'>) => {
    const newAccount: TelegramAccount = {
      ...account,
      id: `acc_${Date.now()}`,
    };
    setAccounts(prev => [...prev, newAccount]);
  }, []);

  const updateAccount = useCallback((id: string, updates: Partial<TelegramAccount>) => {
    setAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, ...updates } : acc));
  }, []);

  const deleteAccount = useCallback((id: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
  }, []);

  // Templates
  const addTemplate = useCallback((template: Omit<CopyTemplate, 'id' | 'createdAt'>) => {
    const newTemplate: CopyTemplate = {
      ...template,
      id: `tpl_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTemplates(prev => [...prev, newTemplate]);
  }, []);

  const updateTemplate = useCallback((id: string, updates: Partial<CopyTemplate>) => {
    setTemplates(prev => prev.map(tpl => tpl.id === id ? { ...tpl, ...updates } : tpl));
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(tpl => tpl.id !== id));
  }, []);

  // Prompts
  const addPrompt = useCallback((prompt: Omit<AIPrompt, 'id' | 'createdAt'>) => {
    const newPrompt: AIPrompt = {
      ...prompt,
      id: `prm_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPrompts(prev => [...prev, newPrompt]);
  }, []);

  const updatePrompt = useCallback((id: string, updates: Partial<AIPrompt>) => {
    setPrompts(prev => prev.map(prm => prm.id === id ? { ...prm, ...updates } : prm));
  }, []);

  const deletePrompt = useCallback((id: string) => {
    setPrompts(prev => prev.filter(prm => prm.id !== id));
  }, []);

  // Campaigns
  const addCampaign = useCallback((campaign: Omit<Campaign, 'id' | 'createdAt'>) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: `cmp_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCampaigns(prev => [...prev, newCampaign]);
  }, []);

  const updateCampaign = useCallback((id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(cmp => cmp.id === id ? { ...cmp, ...updates } : cmp));
  }, []);

  const deleteCampaign = useCallback((id: string) => {
    setCampaigns(prev => prev.filter(cmp => cmp.id !== id));
  }, []);

  const startCampaign = useCallback((id: string) => {
    setCampaigns(prev => prev.map(cmp => 
      cmp.id === id ? { ...cmp, status: 'running' as CampaignStatus, startedAt: new Date().toISOString() } : cmp
    ));
  }, []);

  const pauseCampaign = useCallback((id: string) => {
    setCampaigns(prev => prev.map(cmp => 
      cmp.id === id ? { ...cmp, status: 'paused' as CampaignStatus } : cmp
    ));
  }, []);

  const resumeCampaign = useCallback((id: string) => {
    setCampaigns(prev => prev.map(cmp => 
      cmp.id === id ? { ...cmp, status: 'running' as CampaignStatus } : cmp
    ));
  }, []);

  const cancelCampaign = useCallback((id: string) => {
    setCampaigns(prev => prev.map(cmp => 
      cmp.id === id ? { ...cmp, status: 'completed' as CampaignStatus, endedAt: new Date().toISOString() } : cmp
    ));
  }, []);

  // Messages
  const addMessage = useCallback((message: Omit<OutreachMessage, 'id'>) => {
    const newMessage: OutreachMessage = { ...message, id: `msg_${Date.now()}` };
    setMessages(prev => [newMessage, ...prev]);
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<OutreachMessage>) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  // behavior helpers
  const isWithinQuietHours = (respect: boolean) => {
    if (!respect) return false;
    const hour = new Date().getHours();
    return hour >= 22 || hour < 8;
  };

  const canSendFromAccount = (account: TelegramAccount): boolean => {
    if (account.status !== 'connected') return false;
    if (account.sentToday >= account.dailyLimit) return false;
    if (isWithinQuietHours(account.settings.respectQuietHours)) return false;
    const last = account.settings.lastSentAt ? new Date(account.settings.lastSentAt) : undefined as any;
    if (last) {
      const elapsed = Date.now() - new Date(last).getTime();
      if (elapsed < account.settings.delaySeconds * 1000) return false;
    }
    return true;
  };

  // scheduler: tick every second to move queued -> sending -> sent/failed
  useEffect(() => {
    const timer = setInterval(() => {
      setCampaigns(prevCampaigns => {
        const runningCampaignIds = prevCampaigns.filter(c => c.status === 'running').map(c => c.id);
        if (runningCampaignIds.length === 0) return prevCampaigns;

        // Attempt to send one message per eligible account across running campaigns
        setMessages(prevMessages => {
          let updatedMessages = [...prevMessages];
          let changed = false;

          const accountsById = new Map(accounts.map(a => [a.id, a] as const));

          for (const campaignId of runningCampaignIds) {
            for (const account of accounts) {
              if (!canSendFromAccount(account)) continue;
              // find first queued message for this campaign+account
              const idx = updatedMessages.findIndex(m => m.campaignId === campaignId && m.accountId === account.id && m.status === 'queued');
              if (idx === -1) continue;
              // move to sending
              updatedMessages[idx] = { ...updatedMessages[idx], status: 'sending' };
              changed = true;
              // simulate network send
              const msgId = updatedMessages[idx].id;
              setTimeout(() => {
                setMessages(curr => {
                  const i = curr.findIndex(m => m.id === msgId);
                  if (i === -1) return curr;
                  const fail = Math.random() < 0.1;
                  const newStatus: MessageStatus = fail ? 'failed' : 'sent';
                  const newArr = [...curr];
                  newArr[i] = { ...newArr[i], status: newStatus, sentAt: fail ? null : new Date() };
                  return newArr;
                });
                // update account and campaign counters
                setAccounts(curr => curr.map(a => a.id === account.id
                  ? {
                      ...a,
                      sentToday: Math.min(a.dailyLimit, a.sentToday + 1),
                      settings: { ...a.settings, lastSentAt: new Date() as any },
                    }
                  : a
                ));
                setCampaigns(curr => curr.map(c => c.id === campaignId
                  ? { ...c, sentCount: c.sentCount + 1, queuedCount: Math.max(0, c.queuedCount - 1) }
                  : c
                ));
              }, 400 + Math.random() * 800);
            }
          }

          return changed ? updatedMessages : prevMessages;
        });

        return prevCampaigns;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [accounts]);

  return (
    <AppContext.Provider
      value={{
        accounts,
        templates,
        prompts,
        campaigns,
        messages,
        addAccount,
        updateAccount,
        deleteAccount,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        addPrompt,
        updatePrompt,
        deletePrompt,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        startCampaign,
        pauseCampaign,
        resumeCampaign,
        cancelCampaign,
      addMessage,
      updateMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
