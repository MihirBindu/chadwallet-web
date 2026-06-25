"use client";

import { useState } from "react";
import useSWR from "swr";
import type { Holder } from "@/lib/tokens";
import ScreenHeader from "./ScreenHeader";
import SegmentedControl from "./SegmentedControl";
import { fmtUsdShort } from "@/lib/format";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Trader = { wallet: string; pnlUsd: number; trades: number };

export default function ResearchClient({ address }: { address: string }) {
  const [tab, setTab] = useState("Top Holders");
  const { data } = useSWR<{ holders: Holder[]; traders: Trader[] }>(`/api/research/${address}`, fetcher);
  const holders = data?.holders ?? [];
  const traders = data?.traders ?? [];

  return (
    <div className="flex flex-col flex-1">
      <ScreenHeader title="Research" />
      <div className="px-4">
        <SegmentedControl
          options={["Top Holders", "Top Traders", "Bubblemap"]}
          value={tab}
          onChange={setTab}
        />
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {tab === "Top Holders" && (
          <div className="flex flex-col gap-2">
            {holders.map((h, i) => (
              <div key={h.wallet + i} className="flex items-center justify-between text-sm border-b border-cw-border/50 pb-2">
                <span className="text-cw-text-dim">{h.wallet}</span>
                <span>
                  {h.pct.toFixed(2)}% · {fmtUsdShort(h.valueUsd)}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "Top Traders" && (
          <div className="flex flex-col gap-2">
            {traders.map((t, i) => (
              <div key={t.wallet + i} className="flex items-center justify-between text-sm border-b border-cw-border/50 pb-2">
                <span className="text-cw-text-dim">{t.wallet}</span>
                <span className={t.pnlUsd >= 0 ? "text-cw-green" : "text-cw-red"}>
                  {t.pnlUsd >= 0 ? "+" : ""}
                  {fmtUsdShort(t.pnlUsd)} · {t.trades} trades
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "Bubblemap" && (
          <div className="flex flex-col items-center justify-center h-72 gap-3 text-cw-text-dim text-sm">
            <div className="relative h-48 w-48">
              {holders.slice(0, 7).map((h, i) => {
                const size = 24 + h.pct * 4;
                const angle = (i / 7) * Math.PI * 2;
                const radius = 60;
                const x = 96 + Math.cos(angle) * radius - size / 2;
                const y = 96 + Math.sin(angle) * radius - size / 2;
                return (
                  <span
                    key={h.wallet + i}
                    className="absolute rounded-full bg-cw-green/30 border border-cw-green flex items-center justify-center text-[10px]"
                    style={{ width: size, height: size, left: x, top: y }}
                  >
                    {h.pct.toFixed(0)}%
                  </span>
                );
              })}
              <span className="absolute inset-0 flex items-center justify-center font-bold text-cw-green text-xs">
                TOKEN
              </span>
            </div>
            <span>Powered by Bubblemaps</span>
          </div>
        )}
      </div>
    </div>
  );
}
