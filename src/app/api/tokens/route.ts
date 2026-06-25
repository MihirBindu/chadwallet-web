import { NextResponse } from "next/server";
import { getTrendingTokens } from "@/lib/tokens";

export async function GET() {
  const tokens = await getTrendingTokens();
  return NextResponse.json({ tokens });
}
