"use client";

import { useAuth } from "@/lib/AuthContext";

export default function SignInButton({ className = "" }: { className?: string }) {
  const { ready, authenticated, userLabel, login, logout, error } = useAuth();

  if (!ready) {
    return (
      <button className={`rounded-full bg-cw-panel-2 px-6 py-3 font-semibold text-cw-text-dim ${className}`} disabled>
        Loading...
      </button>
    );
  }

  if (authenticated) {
    return (
      <button
        className={`rounded-full bg-cw-panel-2 border border-cw-border px-6 py-3 font-semibold text-foreground transition hover:border-cw-green ${className}`}
        onClick={logout}
        title="Sign out"
      >
        {userLabel ?? "Account"}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        className={`rounded-full bg-cw-green px-6 py-3 font-semibold text-cw-navy transition hover:bg-cw-green-dark ${className}`}
        onClick={login}
      >
        Sign in
      </button>
      {error && <span className="text-xs text-cw-red">{error}</span>}
    </div>
  );
}
