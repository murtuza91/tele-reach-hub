import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const loadFromLocalStorage = (): AuthState => {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null };
  }
  
  const authed = localStorage.getItem('trh_authed') === '1';
  const userRaw = localStorage.getItem('trh_user');
  const user = userRaw ? JSON.parse(userRaw) : null;
  
  return { isAuthenticated: authed, user };
};

const initialState: AuthState = loadFromLocalStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<{ name: string }>) => {
      state.isAuthenticated = true;
      state.user = {
        id: `user_${Date.now()}`,
        name: action.payload.name,
      };
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;

