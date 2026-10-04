"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, loading, session } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) router.replace("/bookmarks");
  }, [session, router]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      if (mode === "login") await login(email, password);
      else await register(email, password);
      router.push("/bookmarks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold tracking-tight">
        {mode === "login" ? "Sign in" : "Create account"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Bookmarks, followed topics, and saved views sync to your account. Local data merges on sign
        in.
      </p>
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Email
          <Input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <Input
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" disabled={loading}>
          {loading ? "Working…" : mode === "login" ? "Sign in" : "Register"}
        </Button>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">
        {mode === "login" ? "No account yet?" : "Already registered?"}{" "}
        <button
          type="button"
          className="text-foreground underline-offset-4 hover:underline"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError(null);
          }}
        >
          {mode === "login" ? "Register" : "Sign in"}
        </button>
        {" · "}
        <Link href="/" className="underline-offset-4 hover:underline">
          Back to Overview
        </Link>
      </p>
    </div>
  );
}
