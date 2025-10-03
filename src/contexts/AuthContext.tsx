import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  user: { id: string; name: string } | null;
  signIn: (name: string, password?: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('trh_authed') === '1';
  });
  const [user, setUser] = useState<{ id: string; name: string } | null>(() => {
    const raw = localStorage.getItem('trh_user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    localStorage.setItem('trh_authed', isAuthenticated ? '1' : '0');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('trh_user', JSON.stringify(user));
  }, [user]);

  const signIn = async (name: string, _password?: string) => {
    await new Promise(r => setTimeout(r, 500));
    setUser({ id: `user_${Date.now()}`, name });
    setIsAuthenticated(true);
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = useMemo(() => ({ isAuthenticated, user, signIn, signOut }), [isAuthenticated, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}



