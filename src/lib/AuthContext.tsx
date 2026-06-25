"use client";

import { createContext, useContext } from "react";

export type AuthState = {
  configured: boolean;
  ready: boolean;
  authenticated: boolean;
  userLabel: string | null;
  walletAddress: string | null;
  walletPending: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
  /** Returns true if the user is signed in. If not, triggers sign-in and returns false. */
  requireAuth: () => boolean;
};

const stub: AuthState = {
  configured: false,
  ready: true,
  authenticated: false,
  userLabel: null,
  walletAddress: null,
  walletPending: false,
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
};

export const AuthContext = createContext<AuthState>(stub);

export function useAuth() {
  return useContext(AuthContext);
}
