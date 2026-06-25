"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import type { Token } from "@/lib/tokens";
import type { KolEvent, MemeTweet } from "@/lib/mock";
import { fmtCompact, fmtPrice } from "@/lib/format";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const TABS = ["Live", "KOLs", "Memecoin", "Trending"] as const;
type Tab = (typeof TABS)[number];

export default function HomeClient() {
  const params = useSearchParams();
  const initial = (params.get("tab") ?? "live").toLowerCase();
  const initialTab = TABS.find((t) => t.toLowerCase() === initial) ?? "Live";
  const [tab, setTab] = useState<Tab>(initialTab);

  const { data } = useSWR<{ tokens: Token[]; kol: KolEvent[]; meme: MemeTweet[] }>(
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
        <button className="h-9 w-9 rounded-full bg-cw-panel-2 flex items-center justify-center text-sm">?</button>
        <div className="flex-1 flex items-center gap-2 rounded-full bg-cw-panel-2 px-4 py-2.5 text-cw-text-dim text-sm">
          🔍 <span>Tokens, wallets, #tweets</span>
        </div>
      </div>

      <div className="px-4 flex items-center gap-5 text-sm font-medium border-b border-cw-border pb-3 mb-2 overflow-x-auto cw-scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? "text-cw-green" : "text-cw-text-dim"}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Memecoin" && (
        <div className="px-4 pb-2">
          <Link
            href="/app/launch"
            className="block w-full text-center rounded-full border border-cw-green text-cw-green font-semibold py-2 text-sm"
          >
            + Launch your own meme coin
          </Link>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {tab === "Live" && <LiveList tokens={tokens} />}
        {tab === "KOLs" && <KolList events={kol} />}
        {tab === "Memecoin" && <MemeList tweets={meme} />}
        {tab === "Trending" && <LiveList tokens={[...tokens].sort((a, b) => b.change24h - a.change24h)} />}
      </div>
    </div>
  );
}

function LiveList({ tokens }: { tokens: Token[] }) {
  return (
    <div className="flex flex-col gap-1">
      {tokens.map((t) => (
        <Link
          key={t.address}
          href={`/app/token/${t.address}`}
          className="flex items-center gap-3 py-2.5 border-b border-cw-border/50"
        >
          <span className="h-9 w-9 rounded-full bg-cw-panel-2 flex items-center justify-center text-sm font-bold text-cw-green shrink-0">
            {t.symbol.slice(0, 1)}
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{t.name}</div>
            <div className="text-xs text-cw-text-dim">${fmtCompact(t.marketCapUsd)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{fmtPrice(t.priceUsd)}</div>
            <div className={`text-xs font-medium ${t.change24h >= 0 ? "text-cw-green" : "text-cw-red"}`}>
              {t.change24h >= 0 ? "▲" : "▼"} {Math.abs(t.change24h).toFixed(2)}%
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function KolList({ events }: { events: KolEvent[] }) {
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
            <span>${e.amountUsd.toFixed(2)}</span>
            <span className="text-cw-text-dim ml-auto text-xs">{e.minutesAgo}m ago</span>
          </div>
          <Link
            href={`/app/token/${e.token.address}`}
            className="flex items-center justify-between rounded-xl bg-cw-panel px-3 py-2 border border-cw-border"
          >
            <div>
              <div className="font-semibold text-sm">{e.token.name}</div>
              <div className="text-xs text-cw-text-dim">{fmtPrice(e.token.priceUsd)}</div>
            </div>
            <span className="rounded-full bg-cw-green px-3 py-1 text-xs font-semibold text-cw-navy">Buy</span>
          </Link>
        </div>
      ))}
    </div>
  );
}

function MemeList({ tweets }: { tweets: MemeTweet[] }) {
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
            className="block w-full text-center rounded-full bg-cw-green py-2 text-sm font-semibold text-cw-navy"
          >
            Buy {t.token.symbol}
          </Link>
        </div>
      ))}
    </div>
  );
}
