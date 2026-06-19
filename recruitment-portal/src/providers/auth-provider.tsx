'use client';

import { createContext, useContext, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useMe } from '@/hooks/use-auth';
import { queryKeys } from '@/lib/query-client';
import type { AuthUser } from '@/types';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError } = useMe();
  const queryClient = useQueryClient();

  // The Axios interceptor fires this when a refresh fails. Clear the cached user
  // so the UI flips to the signed-out state immediately.
  useEffect(() => {
    const onLogout = () => queryClient.setQueryData(queryKeys.auth.me, null);
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, [queryClient]);

  const user = isError ? null : (data ?? null);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
