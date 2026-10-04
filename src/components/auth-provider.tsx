"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import {
  fetchProfile,
  fetchWorkspace,
  loginAccount,
  readAuthToken,
  registerAccount,
  saveWorkspace,
  writeAuthToken,
} from "@/lib/auth-api";
import {
  BOOKMARKS_EVENT,
  FOLLOWED_TOPICS_EVENT,
  mergeWorkspaces,
  readLocalWorkspace,
  SAVED_VIEWS_EVENT,
  writeLocalWorkspace,
} from "@/lib/local-workspace";
import type { AuthSession } from "@/lib/types";

type AuthContextValue = {
  session: AuthSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function subscribeAuth(onChange: () => void) {
  window.addEventListener("aicc-auth", onChange);
  return () => window.removeEventListener("aicc-auth", onChange);
}

function readSessionSnapshot(): AuthSession | null {
  const token = readAuthToken();
  if (!token) return null;
  const email = sessionStorage.getItem("aicc-auth-email");
  const userId = sessionStorage.getItem("aicc-auth-user-id");
  if (!email || !userId) return null;
  return { token, email, userId };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useSyncExternalStore(subscribeAuth, readSessionSnapshot, () => null);
  const [loading, setLoading] = useState(false);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncing = useRef(false);

  const persistSession = useCallback((next: AuthSession | null) => {
    writeAuthToken(next?.token ?? null);
    if (next) {
      sessionStorage.setItem("aicc-auth-email", next.email);
      sessionStorage.setItem("aicc-auth-user-id", next.userId);
    } else {
      sessionStorage.removeItem("aicc-auth-email");
      sessionStorage.removeItem("aicc-auth-user-id");
    }
  }, []);

  const pushWorkspace = useCallback(async () => {
    const token = readAuthToken();
    if (!token || syncing.current) return;
    syncing.current = true;
    try {
      await saveWorkspace(token, readLocalWorkspace());
    } finally {
      syncing.current = false;
    }
  }, []);

  const schedulePush = useCallback(() => {
    if (!readAuthToken()) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      void pushWorkspace();
    }, 600);
  }, [pushWorkspace]);

  useEffect(() => {
    const events = [BOOKMARKS_EVENT, FOLLOWED_TOPICS_EVENT, SAVED_VIEWS_EVENT];
    for (const event of events) {
      window.addEventListener(event, schedulePush);
    }
    return () => {
      for (const event of events) {
        window.removeEventListener(event, schedulePush);
      }
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [schedulePush]);

  useEffect(() => {
    const token = readAuthToken();
    if (!token) return;
    let active = true;
    void (async () => {
      try {
        const profile = await fetchProfile(token);
        if (!active) return;
        persistSession({ token, email: profile.email, userId: profile.userId });
        const remote = await fetchWorkspace(token);
        if (!active) return;
        const merged = mergeWorkspaces(readLocalWorkspace(), remote);
        writeLocalWorkspace(merged);
        if (JSON.stringify(merged) !== JSON.stringify(remote)) {
          await saveWorkspace(token, merged);
        }
      } catch {
        if (active) persistSession(null);
      }
    })();
    return () => {
      active = false;
    };
  }, [persistSession]);

  const completeAuth = useCallback(
    async (next: AuthSession) => {
      persistSession(next);
      const local = readLocalWorkspace();
      const remote = await fetchWorkspace(next.token);
      const merged = mergeWorkspaces(local, remote);
      writeLocalWorkspace(merged);
      await saveWorkspace(next.token, merged);
    },
    [persistSession],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        await completeAuth(await loginAccount(email, password));
      } finally {
        setLoading(false);
      }
    },
    [completeAuth],
  );

  const register = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        await completeAuth(await registerAccount(email, password));
      } finally {
        setLoading(false);
      }
    },
    [completeAuth],
  );

  const logout = useCallback(() => {
    persistSession(null);
  }, [persistSession]);

  const value = useMemo(
    () => ({ session, loading, login, register, logout }),
    [session, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
