import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import accountsReducer from './slices/accountsSlice';
import templatesReducer from './slices/templatesSlice';
import promptsReducer from './slices/promptsSlice';
import campaignsReducer from './slices/campaignsSlice';
import messagesReducer from './slices/messagesSlice';
import { localStorageMiddleware } from './middleware/localStorageMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
    templates: templatesReducer,
    prompts: promptsReducer,
    campaigns: campaignsReducer,
    messages: messagesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['accounts/updateAccount', 'messages/addMessage'],
        ignoredPaths: ['accounts.items', 'messages.items'],
      },
    }).concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

