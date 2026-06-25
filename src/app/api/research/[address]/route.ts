import { NextResponse } from "next/server";
import { getMockHolders } from "@/lib/tokens";

export async function GET() {
  const holders = getMockHolders();
  const traders = holders.map((h, i) => ({
    wallet: h.wallet,
    pnlUsd: Math.round((Math.random() - 0.4) * 5000),
    trades: 10 + i * 4,
  }));
  return NextResponse.json({ holders, traders });
}
