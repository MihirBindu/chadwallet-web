import { NextResponse } from "next/server";
import { getToken, getMockTrades, getMockHolders } from "@/lib/tokens";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  const token = await getToken(address);
  // `token: null` (vs. an absent response entirely, which means "still loading"
  // on the client) lets callers distinguish "not found" from "loading".
  return NextResponse.json({
    token: token ?? null,
    trades: token ? getMockTrades(address) : [],
    holders: token ? getMockHolders() : [],
  });
}
