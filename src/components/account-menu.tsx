"use client";

import Link from "next/link";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";

export function AccountMenu() {
  const { session, logout } = useAuth();

  if (!session) {
    return (
      <Link
        href="/login"
        className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-muted"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <span className="hidden max-w-[10rem] truncate text-xs text-muted-foreground sm:inline">
        {session.email}
      </span>
      <Button type="button" variant="ghost" size="sm" onClick={logout}>
        Sign out
      </Button>
    </div>
  );
}
