import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CopyTemplate } from '@/types';
import { mockTemplates } from '@/lib/mockData';

interface TemplatesState {
  items: CopyTemplate[];
}

const loadFromLocalStorage = (): TemplatesState => {
  if (typeof window === 'undefined') {
    return { items: mockTemplates };
  }
  
  const stored = localStorage.getItem('trh_templates');
  return { items: stored ? JSON.parse(stored) : mockTemplates };
};

const initialState: TemplatesState = loadFromLocalStorage();

const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    addTemplate: (state, action: PayloadAction<Omit<CopyTemplate, 'id' | 'createdAt'>>) => {
      const newTemplate: CopyTemplate = {
        ...action.payload,
        id: `tpl_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      state.items.push(newTemplate);
    },
    updateTemplate: (state, action: PayloadAction<{ id: string; updates: Partial<CopyTemplate> }>) => {
      const index = state.items.findIndex(tpl => tpl.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.updates };
      }
    },
    deleteTemplate: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(tpl => tpl.id !== action.payload);
    },
    duplicateTemplate: (state, action: PayloadAction<string>) => {
      const template = state.items.find(tpl => tpl.id === action.payload);
      if (template) {
        const newTemplate: CopyTemplate = {
          ...template,
          id: `tpl_${Date.now()}`,
          title: `${template.title} (Copy)`,
          createdAt: new Date().toISOString(),
          isDefault: false,
        };
        state.items.push(newTemplate);
      }
    },
  },
});

export const { addTemplate, updateTemplate, deleteTemplate, duplicateTemplate } = templatesSlice.actions;
export default templatesSlice.reducer;

