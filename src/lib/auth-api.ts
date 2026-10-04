import { apiBase } from "@/lib/api";
import type { AuthSession, WorkspaceState } from "@/lib/types";

const TOKEN_KEY = "aicc-auth-token";

export function readAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function writeAuthToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("aicc-auth"));
}

async function authFetch<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { detail?: string };
      if (body.detail) detail = body.detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return response.json() as Promise<T>;
}

export function registerAccount(email: string, password: string): Promise<AuthSession> {
  return authFetch<AuthSession>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function loginAccount(email: string, password: string): Promise<AuthSession> {
  return authFetch<AuthSession>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function fetchWorkspace(token: string): Promise<WorkspaceState> {
  return authFetch<WorkspaceState>("/api/v1/workspace", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function saveWorkspace(token: string, workspace: WorkspaceState): Promise<WorkspaceState> {
  return authFetch<WorkspaceState>("/api/v1/workspace", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(workspace),
  });
}

export function fetchProfile(token: string): Promise<{ email: string; userId: string }> {
  return authFetch("/api/v1/auth/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}
