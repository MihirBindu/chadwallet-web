"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import type { Token } from "@/lib/tokens";
import type { KolEvent, MemeTweet } from "@/lib/mock";
import { fmtCompact, fmtPrice, tokenColor } from "@/lib/format";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const TABS = ["Live", "KOLs", "Memecoin", "Trending"] as const;
type Tab = (typeof TABS)[number];

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1.2.9-1.2 1.7v.3" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function HomeClient() {
  const params = useSearchParams();
  const initial = (params.get("tab") ?? "live").toLowerCase();
  const initialTab = TABS.find((t) => t.toLowerCase() === initial) ?? "Live";
  const [tab, setTab] = useState<Tab>(initialTab);

  const { data, isLoading } = useSWR<{ tokens: Token[]; kol: KolEvent[]; meme: MemeTweet[] }>(
    "/api/feed",
    fetcher,
    { refreshInterval: 15000 }
  );
  const tokens = data?.tokens ?? [];
  const kol = data?.kol ?? [];
  const meme = data?.meme ?? [];

  return (
    <div className="flex flex-col flex-1">
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <button
          className="h-9 w-9 rounded-full bg-cw-panel-2 flex items-center justify-center text-cw-text-dim hover:text-foreground transition"
          aria-label="Help"
        >
          <HelpIcon />
        </button>
        <div className="flex-1 flex items-center gap-2 rounded-full bg-cw-panel-2 px-4 py-2.5 text-cw-text-dim text-sm">
          <SearchIcon />
          <span>Tokens, wallets, #tweets</span>
        </div>
      </div>

      <div className="px-4 flex items-center gap-5 text-sm font-semibold border-b border-cw-border pb-3 mb-1 overflow-x-auto cw-scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative pb-0.5 transition ${tab === t ? "text-cw-green" : "text-cw-text-dim hover:text-foreground"}`}
          >
            {t}
            {tab === t && <span className="absolute -bottom-[13px] left-0 right-0 h-0.5 rounded-full bg-cw-green" />}
          </button>
        ))}
      </div>

      {tab === "Memecoin" && (
        <div className="px-4 pt-3 pb-1">
          <Link
            href="/app/launch"
            className="block w-full text-center rounded-full border border-cw-green text-cw-green font-semibold py-2 text-sm hover:bg-cw-green/10 transition"
          >
            + Launch your own meme coin
          </Link>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-1">
        {isLoading ? (
          <ListSkeleton />
        ) : (
          <>
            {tab === "Live" && <LiveList tokens={tokens} />}
            {tab === "KOLs" && <KolList events={kol} />}
            {tab === "Memecoin" && <MemeList tweets={meme} />}
            {tab === "Trending" && (
              <LiveList tokens={[...tokens].sort((a, b) => b.change24h - a.change24h)} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-2 pt-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2.5 animate-pulse">
          <div className="h-9 w-9 rounded-full bg-cw-panel-2 shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-3 w-24 rounded bg-cw-panel-2" />
            <div className="h-2.5 w-14 rounded bg-cw-panel-2" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="h-3 w-12 rounded bg-cw-panel-2" />
            <div className="h-2.5 w-10 rounded bg-cw-panel-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TokenAvatar({ symbol, size = "md" }: { symbol: string; size?: "md" | "sm" }) {
  return (
    <span
      className={`${size === "md" ? "h-9 w-9" : "h-7 w-7"} rounded-full flex items-center justify-center text-sm font-bold shrink-0`}
      style={{ backgroundColor: `${tokenColor(symbol)}26`, color: tokenColor(symbol) }}
    >
      {symbol.slice(0, 1)}
    </span>
  );
}

function LiveList({ tokens }: { tokens: Token[] }) {
  if (tokens.length === 0) {
    return <p className="text-cw-text-dim text-sm text-center py-8">No tokens to show right now.</p>;
  }
  return (
    <div className="flex flex-col gap-0.5">
      {tokens.map((t) => (
        <Link
          key={t.address}
          href={`/app/token/${t.address}`}
          className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-cw-panel-2/60 transition"
        >
          <TokenAvatar symbol={t.symbol} />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{t.name}</div>
            <div className="text-xs text-cw-text-dim">${fmtCompact(t.marketCapUsd)} mcap</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium tabular-nums">{fmtPrice(t.priceUsd)}</div>
            <div className={`text-xs font-medium tabular-nums ${t.change24h >= 0 ? "text-cw-green" : "text-cw-red"}`}>
              {t.change24h >= 0 ? "▲" : "▼"} {Math.abs(t.change24h).toFixed(2)}%
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function KolList({ events }: { events: KolEvent[] }) {
  if (events.length === 0) {
    return <p className="text-cw-text-dim text-sm text-center py-8">No KOL activity yet.</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {events.map((e) => (
        <div key={e.id} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm">
            <span className="h-7 w-7 rounded-full bg-cw-panel-2 flex items-center justify-center text-xs font-bold">
              {e.avatarLetter}
            </span>
            <span className="font-semibold">{e.trader}</span>
            <span className={e.side === "bought" ? "text-cw-green" : "text-cw-red"}>{e.side}</span>
            <span className="tabular-nums">${e.amountUsd.toFixed(2)}</span>
            <span className="text-cw-text-dim ml-auto text-xs">{e.minutesAgo}m ago</span>
          </div>
          <Link
            href={`/app/token/${e.token.address}`}
            className="flex items-center justify-between rounded-xl bg-cw-panel px-3 py-2 border border-cw-border hover:border-cw-green/50 transition"
          >
            <div className="flex items-center gap-2 min-w-0">
              <TokenAvatar symbol={e.token.symbol} size="sm" />
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{e.token.name}</div>
                <div className="text-xs text-cw-text-dim tabular-nums">{fmtPrice(e.token.priceUsd)}</div>
              </div>
            </div>
            <span className="rounded-full bg-cw-green px-3 py-1 text-xs font-semibold text-cw-navy shrink-0">Buy</span>
          </Link>
        </div>
      ))}
    </div>
  );
}

function MemeList({ tweets }: { tweets: MemeTweet[] }) {
  if (tweets.length === 0) {
    return <p className="text-cw-text-dim text-sm text-center py-8">No meme coin activity yet.</p>;
  }
  return (
    <div className="flex flex-col gap-4">
      {tweets.map((t) => (
        <div key={t.id} className="rounded-xl border border-cw-border bg-cw-panel p-3">
          <div className="flex items-center gap-2 text-sm mb-2">
            <span className="h-7 w-7 rounded-full bg-cw-panel-2 flex items-center justify-center text-xs font-bold">
              {t.handle.slice(0, 1).toUpperCase()}
            </span>
            <span className="font-semibold">@{t.handle}</span>
            {t.verified && <span className="text-cw-blue-light text-xs">✓</span>}
            <span className="text-cw-text-dim text-xs ml-auto">{t.minutesAgo}m</span>
          </div>
          <p className="text-sm whitespace-pre-line mb-3 text-foreground/90">{t.body}</p>
          {t.hasImage && <div className="rounded-lg bg-cw-panel-2 aspect-square mb-3" />}
          <Link
            href={`/app/token/${t.token.address}`}
            className="block w-full text-center rounded-full bg-cw-green py-2 text-sm font-semibold text-cw-navy hover:bg-cw-green-dark transition"
          >
            Buy {t.token.symbol}
          </Link>
        </div>
      ))}
    </div>
  );
}
