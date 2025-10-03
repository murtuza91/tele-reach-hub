import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AIPrompt } from '@/types';
import { mockPrompts } from '@/lib/mockData';

interface PromptsState {
  items: AIPrompt[];
}

const loadFromLocalStorage = (): PromptsState => {
  if (typeof window === 'undefined') {
    return { items: mockPrompts };
  }
  
  const stored = localStorage.getItem('trh_prompts');
  return { items: stored ? JSON.parse(stored) : mockPrompts };
};

const initialState: PromptsState = loadFromLocalStorage();

const promptsSlice = createSlice({
  name: 'prompts',
  initialState,
  reducers: {
    addPrompt: (state, action: PayloadAction<Omit<AIPrompt, 'id' | 'createdAt'>>) => {
      const newPrompt: AIPrompt = {
        ...action.payload,
        id: `prm_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      state.items.push(newPrompt);
    },
    updatePrompt: (state, action: PayloadAction<{ id: string; updates: Partial<AIPrompt> }>) => {
      const index = state.items.findIndex(prm => prm.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.updates };
      }
    },
    deletePrompt: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(prm => prm.id !== action.payload);
    },
    duplicatePrompt: (state, action: PayloadAction<string>) => {
      const prompt = state.items.find(prm => prm.id === action.payload);
      if (prompt) {
        const newPrompt: AIPrompt = {
          ...prompt,
          id: `prm_${Date.now()}`,
          title: `${prompt.title} (Copy)`,
          createdAt: new Date().toISOString(),
          isDefault: false,
        };
        state.items.push(newPrompt);
      }
    },
  },
});

export const { addPrompt, updatePrompt, deletePrompt, duplicatePrompt } = promptsSlice.actions;
export default promptsSlice.reducer;

