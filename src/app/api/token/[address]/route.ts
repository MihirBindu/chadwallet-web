import { NextResponse } from "next/server";
import { getToken, getMockTrades, getMockHolders } from "@/lib/tokens";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  const token = await getToken(address);
  return NextResponse.json({
    token,
    trades: getMockTrades(address),
    holders: getMockHolders(),
  });
}
