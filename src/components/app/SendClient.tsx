"use client";

import useSWR from "swr";
import AmountEntryScreen from "./AmountEntryScreen";
import type { Token } from "@/lib/tokens";
import type { Holding } from "@/lib/mock";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SendClient({ address }: { address: string }) {
  const isSol = address === "sol";
  const { data: detail } = useSWR<{ token: Token }>(isSol ? null : `/api/token/${address}`, fetcher);
  const { data: account } = useSWR<{ holdings: Holding[] }>("/api/account", fetcher);

  const symbol = isSol ? "SOL" : detail?.token?.symbol ?? "...";
  const holding = account?.holdings.find((h) => h.address === address);
  const available = isSol ? "0.2334 SOL" : holding ? `${(holding.quantity / 1000).toFixed(0)}K ${symbol}` : "0";

  return (
    <AmountEntryScreen
      title={`Send ${symbol}`}
      avatarLetter={symbol.slice(0, 1)}
      unit="TOKEN"
      available={{ label: "Available To Send", amount: available }}
      actionLabel="Next"
      onConfirm={(amount) =>
        alert(`Send ${amount} ${symbol} — requires a connected Privy wallet and recipient address to go live.`)
      }
    />
  );
}
