import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Campaign, CampaignStatus } from '@/types';
import { mockCampaigns } from '@/lib/mockData';

interface CampaignsState {
  items: Campaign[];
}

const loadFromLocalStorage = (): CampaignsState => {
  if (typeof window === 'undefined') {
    return { items: mockCampaigns };
  }
  
  const stored = localStorage.getItem('trh_campaigns');
  return { items: stored ? JSON.parse(stored) : mockCampaigns };
};

const initialState: CampaignsState = loadFromLocalStorage();

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    addCampaign: (state, action: PayloadAction<Omit<Campaign, 'id' | 'createdAt'>>) => {
      const newCampaign: Campaign = {
        ...action.payload,
        id: `cmp_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      state.items.push(newCampaign);
    },
    updateCampaign: (state, action: PayloadAction<{ id: string; updates: Partial<Campaign> }>) => {
      const index = state.items.findIndex(cmp => cmp.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.updates };
      }
    },
    deleteCampaign: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(cmp => cmp.id !== action.payload);
    },
    startCampaign: (state, action: PayloadAction<string>) => {
      const campaign = state.items.find(cmp => cmp.id === action.payload);
      if (campaign) {
        campaign.status = 'running';
        campaign.startedAt = new Date().toISOString();
      }
    },
    pauseCampaign: (state, action: PayloadAction<string>) => {
      const campaign = state.items.find(cmp => cmp.id === action.payload);
      if (campaign) {
        campaign.status = 'paused';
      }
    },
    resumeCampaign: (state, action: PayloadAction<string>) => {
      const campaign = state.items.find(cmp => cmp.id === action.payload);
      if (campaign) {
        campaign.status = 'running';
      }
    },
    cancelCampaign: (state, action: PayloadAction<string>) => {
      const campaign = state.items.find(cmp => cmp.id === action.payload);
      if (campaign) {
        campaign.status = 'completed';
        campaign.endedAt = new Date().toISOString();
      }
    },
    incrementSentCount: (state, action: PayloadAction<string>) => {
      const campaign = state.items.find(cmp => cmp.id === action.payload);
      if (campaign) {
        campaign.sentCount += 1;
        campaign.queuedCount = Math.max(0, campaign.queuedCount - 1);
      }
    },
    incrementFailedCount: (state, action: PayloadAction<string>) => {
      const campaign = state.items.find(cmp => cmp.id === action.payload);
      if (campaign) {
        campaign.failedCount += 1;
        campaign.queuedCount = Math.max(0, campaign.queuedCount - 1);
      }
    },
  },
});

export const {
  addCampaign,
  updateCampaign,
  deleteCampaign,
  startCampaign,
  pauseCampaign,
  resumeCampaign,
  cancelCampaign,
  incrementSentCount,
  incrementFailedCount,
} = campaignsSlice.actions;
export default campaignsSlice.reducer;

