import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OutreachMessage, MessageStatus } from '@/types';
import { mockMessages } from '@/lib/mockData';

interface MessagesState {
  items: OutreachMessage[];
}

const loadFromLocalStorage = (): MessagesState => {
  if (typeof window === 'undefined') {
    return { items: mockMessages };
  }
  
  const stored = localStorage.getItem('trh_messages');
  return { items: stored ? JSON.parse(stored) : mockMessages };
};

const initialState: MessagesState = loadFromLocalStorage();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<OutreachMessage | Omit<OutreachMessage, 'id'>>) => {
      const newMessage: OutreachMessage = 'id' in action.payload 
        ? action.payload as OutreachMessage
        : {
            ...action.payload,
            id: `msg_${Date.now()}_${Math.random()}`,
          };
      state.items.unshift(newMessage);
    },
    updateMessage: (state, action: PayloadAction<{ id: string; updates: Partial<OutreachMessage> }>) => {
      const index = state.items.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.updates };
      }
    },
    deleteMessage: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(m => m.id !== action.payload);
    },
    updateMessageStatus: (
      state,
      action: PayloadAction<{ id: string; status: MessageStatus; sentAt?: string | Date | null; errorMessage?: string | null }>
    ) => {
      const message = state.items.find(m => m.id === action.payload.id);
      if (message) {
        message.status = action.payload.status;
        if (action.payload.sentAt !== undefined) {
          message.sentAt = action.payload.sentAt;
        }
        if (action.payload.errorMessage !== undefined) {
          message.errorMessage = action.payload.errorMessage;
        }
      }
    },
  },
});

export const { addMessage, updateMessage, deleteMessage, updateMessageStatus } = messagesSlice.actions;
export default messagesSlice.reducer;

