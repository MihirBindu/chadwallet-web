"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import type { Holding } from "@/lib/mock";
import PriceChart from "../PriceChart";
import { fmtUsdShort, shortAddr } from "@/lib/format";
import { useAuth } from "@/lib/AuthContext";

const WALLET_STUCK_THRESHOLD_MS = 8000;

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AccountClient() {
  const { ready, authenticated, login, walletAddress, walletPending, userLabel, retryWalletCreation } = useAuth();

  const { data } = useSWR<{
    holdings: Holding[];
    rewards: { claimedUsd: number; creatorUsd: number; referralUsd: number; sharePct: number };
    balanceUsd: number;
  }>(authenticated ? "/api/account" : null, fetcher);

  const holdings = data?.holdings ?? [];
  const rewards = data?.rewards;
  const balanceUsd = data?.balanceUsd ?? 0;

  // Only offer a retry once wallet creation has had a real chance to finish —
  // avoids flashing a "stuck" affordance during the normal brief provisioning window.
  const [walletSeemsStuck, setWalletSeemsStuck] = useState(false);
  useEffect(() => {
    if (!walletPending) {
      setWalletSeemsStuck(false);
      return;
    }
    const timer = setTimeout(() => setWalletSeemsStuck(true), WALLET_STUCK_THRESHOLD_MS);
    return () => clearTimeout(timer);
  }, [walletPending]);

  return (
    <div className="flex flex-col flex-1">
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <button className="h-9 w-9 rounded-full bg-cw-panel-2 flex items-center justify-center text-sm">⚙</button>
        <div className="flex-1 flex items-center gap-2 rounded-full bg-cw-panel-2 px-4 py-2.5 text-cw-text-dim text-sm">
          🔍 <span>Search for tokens or wallets</span>
        </div>
      </div>

      {!ready ? (
        <div className="flex-1 flex items-center justify-center text-cw-text-dim text-sm">Loading...</div>
      ) : !authenticated ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-3">
          <span className="text-4xl">👤</span>
          <h2 className="font-semibold text-lg">You&apos;re not signed in</h2>
          <p className="text-cw-text-dim text-sm">
            Sign in with Google or Apple to see your balance, holdings, and rewards.
          </p>
          <button onClick={login} className="rounded-full bg-cw-green text-cw-navy font-semibold px-6 py-2.5 mt-2">
            Sign in
          </button>
        </div>
      ) : (
        <>
          <div className="px-4 flex items-center justify-between">
            <div>
              <div className="text-3xl font-extrabold">{fmtUsdShort(balanceUsd)}</div>
              <div className="text-cw-green text-sm font-medium mt-1">▲ {fmtUsdShort(balanceUsd)} Past year</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-cw-text-dim truncate max-w-[120px]">{userLabel}</div>
              {walletPending ? (
                <span className="flex items-center gap-2 text-xs text-cw-text-dim">
                  Creating wallet...
                  {walletSeemsStuck && (
                    <button onClick={retryWalletCreation} className="text-cw-green underline">
                      Retry
                    </button>
                  )}
                </span>
              ) : walletAddress ? (
                <span className="rounded-full bg-cw-panel-2 px-2 py-0.5 text-xs text-cw-text-dim">
                  {shortAddr(walletAddress)}
                </span>
              ) : null}
            </div>
          </div>

          <div className="px-4 mt-3">
            <PriceChart basePrice={Math.max(balanceUsd, 1)} />
          </div>

          <div className="px-4 grid grid-cols-4 gap-2 mt-2 mb-5 text-center text-xs font-medium">
            <ActionLink href="/app/send/sol" icon="↑" label="Send" />
            <ActionLink href="/app/home" icon="↓" label="Receive" />
            <ActionLink href="/app/deposit" icon="⬇" label="Deposit" />
            <ActionLink href="/app/withdraw" icon="⬆" label="Withdraw" />
          </div>

          {rewards && (
            <div className="px-4 mb-5">
              <div className="rounded-full bg-cw-green/15 border border-cw-green/40 text-cw-green text-sm font-medium text-center py-2 mb-2">
                🎁 Earn {rewards.sharePct}% of your friends&apos; fees
              </div>
              <div className="grid grid-cols-3 text-sm bg-cw-panel rounded-xl border border-cw-border px-3 py-3">
                <div>
                  <div className="text-cw-text-dim text-xs">Claimed</div>
                  <div className="font-semibold">${rewards.claimedUsd.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-cw-text-dim text-xs">Creator</div>
                  <div className="font-semibold">${rewards.creatorUsd.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-cw-text-dim text-xs">Referral</div>
                  <div className="font-semibold">${rewards.referralUsd.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}

          <div className="px-4 flex-1">
            <h3 className="font-semibold mb-2">Holdings</h3>
            {holdings.length === 0 ? (
              <p className="text-cw-text-dim text-sm">No holdings yet — deposit SOL to start trading.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {holdings.map((h) => (
                  <Link
                    key={h.address}
                    href={`/app/token/${h.address}`}
                    className="flex items-center justify-between rounded-xl border border-cw-border bg-cw-panel px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-8 w-8 rounded-full bg-cw-panel-2 flex items-center justify-center text-xs font-bold text-cw-green">
                        {h.symbol.slice(0, 1)}
                      </span>
                      <div>
                        <div className="font-semibold text-sm">{h.name}</div>
                        <div className="text-xs text-cw-text-dim">{(h.quantity / 1_000_000).toFixed(1)}M</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">${h.valueUsd.toFixed(2)}</div>
                      <div className={`text-xs ${h.pnlUsd >= 0 ? "text-cw-green" : "text-cw-red"}`}>
                        {h.pnlUsd >= 0 ? "▲" : "▼"} ${Math.abs(h.pnlUsd).toFixed(2)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ActionLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1.5">
      <span className="h-12 w-12 rounded-full bg-cw-green text-cw-navy text-xl flex items-center justify-center">
        {icon}
      </span>
      {label}
    </Link>
  );
}
