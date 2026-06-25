import { NextResponse } from "next/server";
import { getUserHoldings, getRewards } from "@/lib/mock";

export async function GET() {
  const holdings = getUserHoldings();
  const balanceUsd = holdings.reduce((sum, h) => sum + h.valueUsd, 0);
  return NextResponse.json({ holdings, rewards: getRewards(), balanceUsd });
}
