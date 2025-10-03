import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TelegramAccount } from '@/types';
import { mockAccounts } from '@/lib/mockData';

interface AccountsState {
  items: TelegramAccount[];
}

const loadFromLocalStorage = (): AccountsState => {
  if (typeof window === 'undefined') {
    return { items: mockAccounts };
  }
  
  const stored = localStorage.getItem('trh_accounts');
  return { items: stored ? JSON.parse(stored) : mockAccounts };
};

const initialState: AccountsState = loadFromLocalStorage();

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    addAccount: (state, action: PayloadAction<Omit<TelegramAccount, 'id'>>) => {
      const newAccount: TelegramAccount = {
        ...action.payload,
        id: `acc_${Date.now()}`,
      };
      state.items.push(newAccount);
    },
    updateAccount: (state, action: PayloadAction<{ id: string; updates: Partial<TelegramAccount> }>) => {
      const index = state.items.findIndex(acc => acc.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.updates };
      }
    },
    deleteAccount: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(acc => acc.id !== action.payload);
    },
    incrementSentToday: (state, action: PayloadAction<string>) => {
      const account = state.items.find(acc => acc.id === action.payload);
      if (account) {
        account.sentToday = Math.min(account.dailyLimit, account.sentToday + 1);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        account.settings.lastSentAt = new Date() as any;
      }
    },
  },
});

export const { addAccount, updateAccount, deleteAccount, incrementSentToday } = accountsSlice.actions;
export default accountsSlice.reducer;

