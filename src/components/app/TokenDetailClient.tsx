"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import type { Holder, Token, Trade } from "@/lib/tokens";
import ScreenHeader from "./ScreenHeader";
import SegmentedControl from "./SegmentedControl";
import PriceChart from "../PriceChart";
import PriceRangeBar from "./PriceRangeBar";
import NumericKeypad, { applyKeypadInput } from "./NumericKeypad";
import { fmtCompact, fmtPrice, fmtUsdShort, shortAddr } from "@/lib/format";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const RANGES = ["LIVE", "1D", "1W", "1M", "3M", "1Y", "5Y"];

export default function TokenDetailClient({ address }: { address: string }) {
  const { data: detail } = useSWR<{ token: Token; trades: Trade[]; holders: Holder[] }>(
    `/api/token/${address}`,
    fetcher,
    { refreshInterval: 10000 }
  );
  const { data: posData } = useSWR<{ position: { quantity: number; valueUsd: number; pnlUsd: number } | null }>(
    `/api/position/${address}`,
    fetcher
  );

  const [view, setView] = useState("Movers");
  const [range, setRange] = useState("1D");
  const [showKeypad, setShowKeypad] = useState(false);
  const [amount, setAmount] = useState("10");

  const token = detail?.token;
  const trades = detail?.trades ?? [];
  const position = posData?.position ?? null;

  if (!token) {
    return (
      <div className="flex-1 flex items-center justify-center text-cw-text-dim">Loading...</div>
    );
  }

  const todayChangeUsd = token.marketCapUsd * (token.change24h / 100);
  const low = token.priceUsd * 0.82;
  const high = token.priceUsd * 1.18;

  return (
    <div className="flex flex-col flex-1">
      <ScreenHeader
        title={token.symbol.toLowerCase()}
        avatarLetter={token.symbol.slice(0, 1)}
        right={
          <>
            <button aria-label="Favorite">☆</button>
            <button aria-label="Share">⤴</button>
          </>
        }
      />

      <div className="px-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-extrabold">${fmtCompact(token.marketCapUsd)}</div>
          <Link
            href={`/app/token/${address}/research`}
            className="rounded-full bg-cw-panel-2 px-3 py-1 text-xs text-cw-text-dim"
          >
            📋 {shortAddr(address)}
          </Link>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className={token.change24h >= 0 ? "text-cw-green font-medium" : "text-cw-red font-medium"}>
            {token.change24h >= 0 ? "▲" : "▼"} {fmtUsdShort(Math.abs(todayChangeUsd))} ({Math.abs(token.change24h).toFixed(2)}%) Today
          </span>
          <SegmentedControl options={["Movers", "Trades"]} value={view} onChange={setView} />
        </div>

        {view === "Movers" ? (
          <PriceChart basePrice={token.priceUsd} />
        ) : (
          <div className="h-72 overflow-y-auto cw-scrollbar-none flex flex-col gap-2 py-2">
            {trades.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm border-b border-cw-border/50 pb-2">
                <span className="text-cw-text-dim">{t.wallet}</span>
                <span className={t.side === "buy" ? "text-cw-green" : "text-cw-red"}>
                  {t.side === "buy" ? "bought" : "sold"} {fmtUsdShort(t.amountUsd)}
                </span>
              </div>
            ))}
          </div>
        )}

        <PriceRangeBar low={low} high={high} />

        <div className="flex items-center gap-4 text-xs font-semibold overflow-x-auto cw-scrollbar-none pb-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={range === r ? "rounded-md bg-cw-green text-cw-navy px-2 py-1" : "text-cw-text-dim px-2 py-1"}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-cw-panel-2 px-3 py-1.5 text-xs text-cw-text-dim flex-1 text-center truncate">
            📋 {shortAddr(address)}
          </span>
          <span className="rounded-full bg-cw-panel-2 px-3 py-1.5 text-xs text-cw-text-dim flex-1 text-center">
            🌐 {token.symbol.toLowerCase()}.com
          </span>
        </div>

        {position && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Your position</h4>
            <div className="grid grid-cols-3 text-sm bg-cw-panel rounded-xl border border-cw-border px-3 py-3">
              <div>
                <div className="text-cw-text-dim text-xs">Quantity</div>
                <div className="font-semibold">{fmtCompact(position.quantity)}</div>
              </div>
              <div>
                <div className="text-cw-text-dim text-xs">Value</div>
                <div className="font-semibold">{fmtUsdShort(position.valueUsd)}</div>
              </div>
              <div>
                <div className="text-cw-text-dim text-xs">PnL</div>
                <div className={`font-semibold ${position.pnlUsd >= 0 ? "text-cw-green" : "text-cw-red"}`}>
                  {position.pnlUsd >= 0 ? "▲" : "▼"} {fmtUsdShort(Math.abs(position.pnlUsd))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto px-4 pb-4 pt-3">
        {!showKeypad ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              {["10", "50", "100"].map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(v)}
                  className={`flex-1 rounded-full border py-2 text-sm font-semibold ${
                    amount === v ? "border-cw-green text-cw-green" : "border-cw-border text-foreground"
                  }`}
                >
                  ${v}
                </button>
              ))}
              <button
                onClick={() => setShowKeypad(true)}
                className="h-9 w-9 rounded-full border border-cw-border flex items-center justify-center"
                aria-label="Custom amount"
              >
                ⌨
              </button>
            </div>
            {position ? (
              <div className="flex gap-3">
                <ActionButton label="Buy" tone="buy" amount={amount} symbol={token.symbol} />
                <ActionButton label="Sell" tone="sell" amount={amount} symbol={token.symbol} />
              </div>
            ) : (
              <ActionButton label="Buy" tone="buy" amount={amount} symbol={token.symbol} full />
            )}
          </>
        ) : (
          <CustomAmountEntry
            amount={amount}
            setAmount={setAmount}
            symbol={token.symbol}
            position={!!position}
            onClose={() => setShowKeypad(false)}
          />
        )}
      </div>
    </div>
  );
}

function ActionButton({
  label,
  tone,
  amount,
  symbol,
  full,
}: {
  label: string;
  tone: "buy" | "sell";
  amount: string;
  symbol: string;
  full?: boolean;
}) {
  return (
    <button
      className={`${full ? "w-full" : "flex-1"} rounded-full py-3 font-semibold transition ${
        tone === "buy" ? "bg-cw-green text-cw-navy hover:bg-cw-green-dark" : "bg-cw-red text-white hover:opacity-90"
      }`}
      onClick={() =>
        alert(
          `${label} $${amount} of ${symbol} — wiring this to a real Jupiter swap requires a signed-in Privy wallet.`
        )
      }
    >
      {label} {symbol}
    </button>
  );
}

function CustomAmountEntry({
  amount,
  setAmount,
  symbol,
  position,
  onClose,
}: {
  amount: string;
  setAmount: (v: string) => void;
  symbol: string;
  position: boolean;
  onClose: () => void;
}) {
  return (
    <div>
      <div className="text-center mb-3">
        <div className="text-4xl font-extrabold">${amount}</div>
        <div className="text-cw-text-dim text-sm">{(Number(amount) / 230).toFixed(4)} SOL</div>
      </div>
      <NumericKeypad onKey={(k) => setAmount(applyKeypadInput(amount, k))} />
      <div className="flex gap-3 mt-3">
        {position ? (
          <>
            <ActionButton label="Buy" tone="buy" amount={amount} symbol={symbol} />
            <ActionButton label="Sell" tone="sell" amount={amount} symbol={symbol} />
          </>
        ) : (
          <ActionButton label="Buy" tone="buy" amount={amount} symbol={symbol} full />
        )}
      </div>
      <button onClick={onClose} className="w-full text-center text-cw-text-dim text-sm py-2 mt-1">
        Done
      </button>
    </div>
  );
}
