import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { clearSession, loadSession, saveSession } from '@/lib/session';
import type { SessionPayload, SessionUser } from '@/types';

interface AuthContextValue {
  ready: boolean;
  isAuthenticated: boolean;
  session: SessionPayload | null;
  user: SessionUser | null;
  token: string | null;
  setAuthenticatedSession: (session: SessionPayload) => Promise<void>;
  updateUser: (user: SessionUser) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<SessionPayload | null>(null);

  useEffect(() => {
    let mounted = true;

    loadSession()
      .then((storedSession) => {
        if (!mounted) return;
        setSession(storedSession);
      })
      .finally(() => {
        if (mounted) {
          setReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      isAuthenticated: Boolean(session?.token && session?.user),
      session,
      user: session?.user || null,
      token: session?.token || null,
      setAuthenticatedSession: async (nextSession) => {
        setSession(nextSession);
        await saveSession(nextSession);
      },
      updateUser: async (user) => {
        if (!session) return;
        const nextSession = { ...session, user };
        setSession(nextSession);
        await saveSession(nextSession);
      },
      signOut: async () => {
        setSession(null);
        await clearSession();
      },
    }),
    [ready, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
