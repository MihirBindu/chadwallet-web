import { NextResponse } from "next/server";
import { getKolFeed, getMemeFeed } from "@/lib/mock";
import { getTrendingTokens } from "@/lib/tokens";

export async function GET() {
  const [tokens, kol, meme] = [await getTrendingTokens(), getKolFeed(), getMemeFeed()];
  return NextResponse.json({ tokens, kol, meme });
}
