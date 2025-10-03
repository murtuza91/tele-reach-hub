import { Middleware } from '@reduxjs/toolkit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const localStorageMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);
  
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: any = store.getState();
    
    // Save auth state
    if (action.type?.startsWith('auth/')) {
      localStorage.setItem('trh_authed', state.auth.isAuthenticated ? '1' : '0');
      localStorage.setItem('trh_user', JSON.stringify(state.auth.user));
    }
    
    // Save accounts
    if (action.type?.startsWith('accounts/')) {
      localStorage.setItem('trh_accounts', JSON.stringify(state.accounts.items));
    }
    
    // Save templates
    if (action.type?.startsWith('templates/')) {
      localStorage.setItem('trh_templates', JSON.stringify(state.templates.items));
    }
    
    // Save prompts
    if (action.type?.startsWith('prompts/')) {
      localStorage.setItem('trh_prompts', JSON.stringify(state.prompts.items));
    }
    
    // Save campaigns
    if (action.type?.startsWith('campaigns/')) {
      localStorage.setItem('trh_campaigns', JSON.stringify(state.campaigns.items));
    }
    
    // Save messages
    if (action.type?.startsWith('messages/')) {
      localStorage.setItem('trh_messages', JSON.stringify(state.messages.items));
    }
  }
  
  return result;
};

