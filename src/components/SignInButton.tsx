"use client";

import { usePrivy } from "@privy-io/react-auth";

export default function SignInButton({ className = "" }: { className?: string }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    return (
      <button
        className={`rounded-full bg-cw-green px-6 py-3 font-semibold text-cw-navy transition hover:bg-cw-green-dark ${className}`}
        onClick={() => alert("Sign-in is not configured yet. Set NEXT_PUBLIC_PRIVY_APP_ID to enable Google/Apple login via Privy.")}
      >
        Sign in
      </button>
    );
  }

  return <SignInButtonReady className={className} />;
}

function SignInButtonReady({ className }: { className?: string }) {
  const { ready, authenticated, user, login, logout } = usePrivy();

  if (!ready) {
    return (
      <button className={`rounded-full bg-cw-panel-2 px-6 py-3 font-semibold text-cw-text-dim ${className}`} disabled>
        Loading...
      </button>
    );
  }

  if (authenticated) {
    const label = user?.email?.address ?? user?.google?.email ?? user?.apple?.email ?? "Account";
    return (
      <button
        className={`rounded-full bg-cw-panel-2 border border-cw-border px-6 py-3 font-semibold text-foreground transition hover:border-cw-green ${className}`}
        onClick={logout}
        title="Sign out"
      >
        {label}
      </button>
    );
  }

  return (
    <button
      className={`rounded-full bg-cw-green px-6 py-3 font-semibold text-cw-navy transition hover:bg-cw-green-dark ${className}`}
      onClick={login}
    >
      Sign in
    </button>
  );
}
