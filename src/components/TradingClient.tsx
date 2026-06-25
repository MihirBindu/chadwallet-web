"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import type { Holder, Token, Trade } from "@/lib/tokens";
import PriceChart from "./PriceChart";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function fmtUsd(n: number, decimals = 2) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(decimals)}`;
}

function shortAddr(a: string) {
  return `${a.slice(0, 4)}...${a.slice(-4)}`;
}

export default function TradingClient({ address }: { address: string }) {
  const { data: tokensData } = useSWR<{ tokens: Token[] }>("/api/tokens", fetcher, {
    refreshInterval: 20000,
  });
  const { data: detailData } = useSWR<{ token: Token | null; trades: Trade[]; holders: Holder[] }>(
    `/api/token/${address}`,
    fetcher,
    { refreshInterval: 10000 }
  );

  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("0.1");

  const tokens = tokensData?.tokens ?? [];
  const token = detailData?.token;
  const trades = detailData?.trades ?? [];
  const holders = detailData?.holders ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-4">
      <aside className="rounded-2xl border border-cw-border bg-cw-panel p-4 h-fit lg:sticky lg:top-4">
        <h3 className="font-semibold mb-3">Trending</h3>
        <div className="flex flex-col gap-1">
          {tokens.map((t) => (
            <Link
              key={t.address}
              href={`/trade/${t.address}`}
              className={`flex items-center justify-between rounded-xl px-3 py-2 hover:bg-cw-panel-2 transition ${
                t.address === address ? "bg-cw-panel-2 border border-cw-green/40" : ""
              }`}
            >
              <div>
                <div className="font-medium text-sm">{t.symbol}</div>
                <div className="text-xs text-cw-text-dim">{t.name}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">{fmtUsd(t.priceUsd, 4)}</div>
                <div className={`text-xs ${t.change24h >= 0 ? "text-cw-green" : "text-cw-red"}`}>
                  {t.change24h >= 0 ? "+" : ""}
                  {t.change24h.toFixed(1)}%
                </div>
              </div>
            </Link>
          ))}
        </div>
      </aside>

      <main className="flex flex-col gap-4">
        <div className="rounded-2xl border border-cw-border bg-cw-panel p-4">
          {token ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-8 w-8 rounded-full bg-cw-panel-2 flex items-center justify-center font-bold text-cw-green">
                      {token.symbol.slice(0, 1)}
                    </span>
                    <h1 className="text-xl font-bold">{token.name}</h1>
                    <span className="text-cw-text-dim">${token.symbol}</span>
                  </div>
                  <div className="text-xs text-cw-text-dim mt-1">{shortAddr(token.address)}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{fmtUsd(token.priceUsd, 6)}</div>
                  <div className={`text-sm font-medium ${token.change24h >= 0 ? "text-cw-green" : "text-cw-red"}`}>
                    {token.change24h >= 0 ? "+" : ""}
                    {token.change24h.toFixed(1)}% (24h)
                  </div>
                </div>
              </div>
              <PriceChart basePrice={token.priceUsd} />
              <div className="grid grid-cols-4 gap-3 mt-4 text-sm">
                <Stat label="Market Cap" value={fmtUsd(token.marketCapUsd)} />
                <Stat label="Volume 24h" value={fmtUsd(token.volume24hUsd)} />
                <Stat label="Liquidity" value={fmtUsd(token.liquidityUsd)} />
                <Stat label="Holders" value={token.holders ? token.holders.toLocaleString() : "—"} />
              </div>
            </>
          ) : detailData === undefined ? (
            <div className="h-[460px] flex items-center justify-center text-cw-text-dim">Loading token...</div>
          ) : (
            <div className="h-[460px] flex flex-col items-center justify-center gap-2 text-center text-cw-text-dim">
              <span className="text-3xl">🔍</span>
              <p className="font-semibold text-foreground">Token not found</p>
              <p className="text-sm">This address doesn&apos;t match a known token.</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-cw-border bg-cw-panel p-4">
            <h3 className="font-semibold mb-3">Live trades</h3>
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto cw-scrollbar-none">
              {trades.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm border-b border-cw-border/60 pb-2">
                  <span className="text-cw-text-dim">{t.wallet}</span>
                  <span className={t.side === "buy" ? "text-cw-green" : "text-cw-red"}>
                    {t.side === "buy" ? "bought" : "sold"} {fmtUsd(t.amountUsd)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-cw-border bg-cw-panel p-4">
            <h3 className="font-semibold mb-3">Top holders</h3>
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto cw-scrollbar-none">
              {holders.map((h, i) => (
                <div key={h.wallet + i} className="flex items-center justify-between text-sm border-b border-cw-border/60 pb-2">
                  <span className="text-cw-text-dim">{h.wallet}</span>
                  <span>{h.pct.toFixed(2)}% · {fmtUsd(h.valueUsd)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <aside className="rounded-2xl border border-cw-border bg-cw-panel p-4 h-fit lg:sticky lg:top-4">
        <div className="flex rounded-full bg-cw-panel-2 p-1 mb-4">
          <button
            onClick={() => setSide("buy")}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
              side === "buy" ? "bg-cw-green text-cw-navy" : "text-cw-text-dim"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setSide("sell")}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
              side === "sell" ? "bg-cw-red text-white" : "text-cw-text-dim"
            }`}
          >
            Sell
          </button>
        </div>

        <label className="text-xs text-cw-text-dim">Amount (SOL)</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mt-1 mb-4 rounded-xl border border-cw-border bg-cw-panel-2 px-3 py-3 text-lg font-semibold outline-none focus:border-cw-green"
          inputMode="decimal"
        />

        <div className="grid grid-cols-4 gap-2 mb-4">
          {["0.1", "0.5", "1", "2"].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className="rounded-lg border border-cw-border py-1.5 text-xs hover:border-cw-green transition"
            >
              {v}
            </button>
          ))}
        </div>

        <button
          className={`w-full rounded-full py-3 font-semibold transition ${
            side === "buy" ? "bg-cw-green text-cw-navy hover:bg-cw-green-dark" : "bg-cw-red text-white hover:opacity-90"
          }`}
          onClick={() =>
            alert(
              "Wiring this button up to a real swap requires a signed-in wallet (Privy) and a Jupiter swap transaction. The quote API is already wired server-side — connect a wallet to go live."
            )
          }
        >
          {side === "buy" ? "Buy" : "Sell"} {token?.symbol ?? ""}
        </button>

        <div className="mt-6 pt-4 border-t border-cw-border">
          <h4 className="text-sm font-semibold mb-2">Your position</h4>
          <div className="text-sm text-cw-text-dim">Sign in to see your balance and position for this token.</div>
        </div>
      </aside>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-cw-panel-2 px-3 py-2">
      <div className="text-cw-text-dim text-xs">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
