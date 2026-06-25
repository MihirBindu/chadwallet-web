"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PrivyProvider, useLogin, usePrivy } from "@privy-io/react-auth";
import { useWallets as useSolanaWallets } from "@privy-io/react-auth/solana";
import { AuthContext, type AuthState } from "@/lib/AuthContext";

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!appId) {
    // Not configured: render children with the default (stub) context value.
    return <>{children}</>;
  }
  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["google", "apple"],
        appearance: {
          theme: "dark",
          accentColor: "#3ddc84",
          logo: "/brand/logo-mark.svg",
        },
        embeddedWallets: {
          solana: { createOnLogin: "users-without-wallets" },
        },
        externalWallets: {
          solana: { connectors: undefined },
        },
      }}
    >
      <AuthBridge>{children}</AuthBridge>
    </PrivyProvider>
  );
}

function AuthBridge({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { ready, authenticated, user, logout } = usePrivy();
  const { wallets } = useSolanaWallets();
  const [error, setError] = useState<string | null>(null);

  const { login } = useLogin({
    onComplete: ({ isNewUser, wasAlreadyAuthenticated }) => {
      setError(null);
      // Only redirect on a real sign-in action, not when the user landed on
      // a page already authenticated (onComplete fires immediately for them too).
      if (wasAlreadyAuthenticated) return;
      router.push(isNewUser ? "/app/home?welcome=1" : "/app/home");
    },
    onError: (err) => {
      // "exited_auth_flow" = user closed the popup/cancelled — not a real error.
      if (err === "exited_auth_flow") {
        setError(null);
        return;
      }
      setError("Sign-in failed. Please try again.");
    },
  });

  const solanaWallet = wallets[0];
  const walletPending = authenticated && !solanaWallet;

  const userLabel =
    user?.email?.address ??
    user?.google?.email ??
    user?.apple?.email ??
    (authenticated ? "Account" : null);

  const value: AuthState = useMemo(
    () => ({
      configured: true,
      ready,
      authenticated,
      userLabel,
      walletAddress: solanaWallet?.address ?? null,
      walletPending,
      error,
      login: () => {
        setError(null);
        login();
      },
      logout,
      requireAuth: () => {
        if (authenticated) return true;
        setError(null);
        login();
        return false;
      },
    }),
    [ready, authenticated, userLabel, solanaWallet, walletPending, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
