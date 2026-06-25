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
  const [loggingIn, setLoggingIn] = useState(false);

  const { login } = useLogin({
    onComplete: ({ isNewUser, wasAlreadyAuthenticated }) => {
      setError(null);
      setLoggingIn(false);
      // Only redirect on a real sign-in action, not when the user landed on
      // a page already authenticated (onComplete fires immediately for them too).
      if (wasAlreadyAuthenticated) return;
      router.push(isNewUser ? "/app/home?welcome=1" : "/app/home");
    },
    onError: (err) => {
      setLoggingIn(false);
      // "exited_auth_flow" = user closed the popup. "oauth_user_denied" = user
      // declined the Google/Apple consent screen. Both are user choices, not failures.
      if (err === "exited_auth_flow" || err === "oauth_user_denied") {
        setError(null);
        return;
      }
      // "client_request_timeout" most often indicates a dropped connection rather
      // than a rejected login, so it gets a more specific message.
      setError(
        err === "client_request_timeout"
          ? "Sign-in timed out — check your connection and try again."
          : "Sign-in failed. Please try again."
      );
    },
  });

  const solanaWallet = wallets[0];
  const walletPending = authenticated && !solanaWallet;

  const userLabel =
    user?.email?.address ??
    user?.google?.email ??
    user?.apple?.email ??
    (authenticated ? "Account" : null);

  const startLogin = () => {
    // Guards against double-firing the OAuth popup on rapid repeated clicks
    // before Privy has transitioned out of the pending state.
    if (loggingIn) return;
    setLoggingIn(true);
    setError(null);
    login();
  };

  const value: AuthState = useMemo(
    () => ({
      configured: true,
      ready,
      authenticated,
      userLabel,
      walletAddress: solanaWallet?.address ?? null,
      walletPending,
      loggingIn,
      error,
      login: startLogin,
      logout,
      requireAuth: () => {
        if (authenticated) return true;
        startLogin();
        return false;
      },
      retryWalletCreation: () => {
        // Reloading re-runs Privy's `createOnLogin: "users-without-wallets"` provisioning
        // for the already-authenticated session — the safest retry without a dedicated
        // wallet-creation API call.
        window.location.reload();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ready, authenticated, userLabel, solanaWallet, walletPending, loggingIn, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
