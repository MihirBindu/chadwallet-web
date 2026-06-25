"use client";

import Link from "next/link";
import useSWR from "swr";
import type { Token } from "@/lib/tokens";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function fmtUsd(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(n < 1 ? 4 : 2)}`;
}

function BannerSkeleton() {
  return (
    <div className="w-full overflow-hidden border-y border-cw-border bg-cw-navy/80 py-3">
      <div className="flex w-max">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-32 rounded-full border border-cw-border bg-cw-panel mx-2 shrink-0 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

function TokenChip({ token }: { token: Token }) {
  const up = token.change24h >= 0;
  return (
    <Link
      href={`/app/token/${token.address}`}
      className="flex items-center gap-2 rounded-full border border-cw-border bg-cw-panel px-4 py-2 mx-2 shrink-0 transition hover:border-cw-green"
    >
      <span className="h-6 w-6 rounded-full bg-cw-panel-2 flex items-center justify-center text-xs font-bold text-cw-green">
        {token.symbol.slice(0, 1)}
      </span>
      <span className="font-semibold text-sm max-w-[120px] truncate">{token.symbol}</span>
      <span className="text-sm text-cw-text-dim">{fmtUsd(token.priceUsd)}</span>
      <span className={`text-sm font-medium ${up ? "text-cw-green" : "text-cw-red"}`}>
        {up ? "+" : ""}
        {token.change24h.toFixed(1)}%
      </span>
    </Link>
  );
}

export default function TokenBanner({ reverse = false }: { reverse?: boolean }) {
  const { data } = useSWR<{ tokens: Token[] }>("/api/tokens", fetcher, {
    refreshInterval: 15000,
    fallbackData: { tokens: [] },
  });
  const tokens = data?.tokens ?? [];
  if (tokens.length === 0) return <BannerSkeleton />;
  const loop = [...tokens, ...tokens];

  return (
    <div className="w-full overflow-hidden border-y border-cw-border bg-cw-navy/80 py-3">
      <div className={`flex w-max ${reverse ? "cw-marquee-track-reverse" : "cw-marquee-track"}`}>
        {loop.map((t, i) => (
          <TokenChip key={`${t.address}-${i}`} token={t} />
        ))}
      </div>
    </div>
  );
}
