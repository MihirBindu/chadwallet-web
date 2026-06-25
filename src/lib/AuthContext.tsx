"use client";

import { createContext, useContext } from "react";

export type AuthState = {
  configured: boolean;
  ready: boolean;
  authenticated: boolean;
  userLabel: string | null;
  walletAddress: string | null;
  walletPending: boolean;
  /** True while a login popup is open/in-flight; used to debounce repeated clicks. */
  loggingIn: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
  /** Returns true if the user is signed in. If not, triggers sign-in and returns false. */
  requireAuth: () => boolean;
  /** Manually retries embedded wallet creation if it appears stuck. */
  retryWalletCreation: () => void;
};

const stub: AuthState = {
  configured: false,
  ready: true,
  authenticated: false,
  userLabel: null,
  walletAddress: null,
  walletPending: false,
  loggingIn: false,
  error: null,
  login: () => {
    alert(
      "Sign-in is not configured yet. Set NEXT_PUBLIC_PRIVY_APP_ID to enable Google/Apple login via Privy."
    );
  },
  logout: () => {},
  requireAuth: () => {
    stub.login();
    return false;
  },
  retryWalletCreation: () => {},
};

export const AuthContext = createContext<AuthState>(stub);

export function useAuth() {
  return useContext(AuthContext);
}
