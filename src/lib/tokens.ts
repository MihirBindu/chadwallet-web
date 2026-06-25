export type Token = {
  address: string;
  symbol: string;
  name: string;
  imageUrl: string;
  priceUsd: number;
  change24h: number;
  marketCapUsd: number;
  volume24hUsd: number;
  liquidityUsd: number;
  holders: number;
};

export type Trade = {
  id: string;
  wallet: string;
  side: "buy" | "sell";
  amountUsd: number;
  timestamp: number;
};

export type Holder = {
  wallet: string;
  pct: number;
  valueUsd: number;
};

export const MOCK_TOKENS: Token[] = [
  { address: "ChadWa11etTokenAAAAAAAAAAAAAAAAAAAAAAAAAA1", symbol: "CHAD", name: "ChadWallet", imageUrl: "/brand/logo-mark.svg", priceUsd: 0.04231, change24h: 12.4, marketCapUsd: 4231000, volume24hUsd: 982000, liquidityUsd: 312000, holders: 8421 },
  { address: "BonkSo1ana11111111111111111111111111111112", symbol: "BONK", name: "Bonk", imageUrl: "/brand/logo-mark.svg", priceUsd: 0.0000234, change24h: -3.2, marketCapUsd: 1540000000, volume24hUsd: 84000000, liquidityUsd: 12000000, holders: 712000 },
  { address: "Wif5o1ana11111111111111111111111111111113", symbol: "WIF", name: "dogwifhat", imageUrl: "/brand/logo-mark.svg", priceUsd: 1.92, change24h: 5.8, marketCapUsd: 1920000000, volume24hUsd: 102000000, liquidityUsd: 18000000, holders: 320000 },
  { address: "Pepe5o1ana1111111111111111111111111111114", symbol: "PEPE2", name: "Pepe Solana", imageUrl: "/brand/logo-mark.svg", priceUsd: 0.00081, change24h: 22.1, marketCapUsd: 81000000, volume24hUsd: 9400000, liquidityUsd: 1200000, holders: 41200 },
  { address: "Disab1edA1pha111111111111111111111111115", symbol: "ALPHA", name: "The Disabled Alpha", imageUrl: "/brand/logo-mark.svg", priceUsd: 0.042725, change24h: -8.9, marketCapUsd: 27250, volume24hUsd: 8900, liquidityUsd: 4200, holders: 312 },
  { address: "BetterFuture1111111111111111111111111116", symbol: "FUTR", name: "A Better Future", imageUrl: "/brand/logo-mark.svg", priceUsd: 0.054967, change24h: 4.6, marketCapUsd: 8430000, volume24hUsd: 540000, liquidityUsd: 92000, holders: 5120 },
];

const CODEX_API_KEY = process.env.CODEX_API_KEY;
const CODEX_API_URL = "https://graph.codex.io/graphql";

export async function getTrendingTokens(): Promise<Token[]> {
  if (!CODEX_API_KEY) return MOCK_TOKENS;
  try {
    const res = await fetch(CODEX_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: CODEX_API_KEY },
      body: JSON.stringify({
        query: `query { listRankedTokens(rankingType: TRENDING, limit: 12, networkFilter: [1399811149]) { items { address symbol name priceUSD change24 marketCap volume24 liquidity } } }`,
      }),
      cache: "no-store",
    });
    if (!res.ok) return MOCK_TOKENS;
    const json = await res.json();
    const items = json?.data?.listRankedTokens?.items;
    if (!Array.isArray(items) || items.length === 0) return MOCK_TOKENS;
    return items.map((t: any) => ({
      address: t.address,
      symbol: t.symbol,
      name: t.name,
      imageUrl: "/brand/logo-mark.svg",
      priceUsd: Number(t.priceUSD) || 0,
      change24h: Number(t.change24) || 0,
      marketCapUsd: Number(t.marketCap) || 0,
      volume24hUsd: Number(t.volume24) || 0,
      liquidityUsd: Number(t.liquidity) || 0,
      holders: 0,
    }));
  } catch {
    return MOCK_TOKENS;
  }
}

export async function getToken(address: string): Promise<Token | undefined> {
  const tokens = await getTrendingTokens();
  return tokens.find((t) => t.address === address) ?? MOCK_TOKENS[0];
}

export function getMockTrades(address: string): Trade[] {
  const wallets = ["jijo", "Roman", "Zrool", "Cupsey", "Esee", "nansen_wal"];
  return Array.from({ length: 20 }, (_, i) => ({
    id: `${address}-${i}`,
    wallet: wallets[i % wallets.length],
    side: i % 3 === 0 ? "sell" : "buy",
    amountUsd: Math.round(50 + Math.random() * 5000),
    timestamp: Date.now() - i * 45_000,
  }));
}

export function getMockHolders(): Holder[] {
  return Array.from({ length: 10 }, (_, i) => ({
    wallet: `${(Math.random() * 1e9).toFixed(0)}...${(Math.random() * 1e4).toFixed(0)}`,
    pct: Math.max(0.4, 22 - i * 2.1),
    valueUsd: Math.round(500000 / (i + 1)),
  }));
}
