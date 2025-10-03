import React, { createContext, useContext, useState, useCallback } from 'react';
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
  const [accounts, setAccounts] = useState<TelegramAccount[]>(initialAccounts);
  const [templates, setTemplates] = useState<CopyTemplate[]>(initialTemplates);
  const [prompts, setPrompts] = useState<AIPrompt[]>(initialPrompts);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [messages, setMessages] = useState<OutreachMessage[]>(initialMessages);

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
