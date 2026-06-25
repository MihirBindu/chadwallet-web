import { MOCK_TOKENS } from "./tokens";

export type KolEvent = {
  id: string;
  trader: string;
  avatarLetter: string;
  side: "bought" | "sold";
  amountUsd: number;
  minutesAgo: number;
  token: { address: string; symbol: string; name: string; priceUsd: number };
};

export type MemeTweet = {
  id: string;
  handle: string;
  verified: boolean;
  minutesAgo: number;
  body: string;
  hasImage: boolean;
  token: { address: string; symbol: string; name: string };
};

export type Holding = {
  address: string;
  symbol: string;
  name: string;
  quantity: number;
  valueUsd: number;
  pnlUsd: number;
};

const TRADERS = ["jijo", "Roman", "Zrool", "Cupsey", "Esee", "bihoz", "Limfork99", "Degener_x"];

export function getKolFeed(): KolEvent[] {
  return Array.from({ length: 14 }, (_, i) => {
    const t = MOCK_TOKENS[i % MOCK_TOKENS.length];
    return {
      id: `kol-${i}`,
      trader: TRADERS[i % TRADERS.length],
      avatarLetter: TRADERS[i % TRADERS.length].slice(0, 1).toUpperCase(),
      side: i % 3 === 0 ? "sold" : "bought",
      amountUsd: Math.round(80 + Math.random() * 4000) / 1,
      minutesAgo: i + 1,
      token: { address: t.address, symbol: t.symbol, name: t.name, priceUsd: t.priceUsd },
    };
  });
}

export function getMemeFeed(): MemeTweet[] {
  return Array.from({ length: 8 }, (_, i) => {
    const t = MOCK_TOKENS[i % MOCK_TOKENS.length];
    return {
      id: `meme-${i}`,
      handle: ["zandyor", "mrcryptoell", "degenkid", "solwhale"][i % 4],
      verified: i % 2 === 0,
      minutesAgo: (i + 1) * 3,
      body:
        i % 2 === 0
          ? "launch in 1 hour\nno presale, no team, just a coin\nca will have snipe blockers\nairdropping 10% of supply"
          : "Everywhere everyday it's solana",
      hasImage: i % 2 === 0,
      token: { address: t.address, symbol: t.symbol, name: t.name },
    };
  });
}

export function getUserHoldings(): Holding[] {
  return [
    { address: MOCK_TOKENS[0].address, symbol: MOCK_TOKENS[0].symbol, name: MOCK_TOKENS[0].name, quantity: 173_700_000, valueUsd: 693.29, pnlUsd: 84.1 },
  ];
}

export function getRewards() {
  return { claimedUsd: 2.8, creatorUsd: 1.15, referralUsd: 0, sharePct: 30 };
}

export function getPositionFor(address: string) {
  const holdings = getUserHoldings();
  const h = holdings.find((x) => x.address === address);
  if (!h) return null;
  return { quantity: h.quantity, valueUsd: h.valueUsd, pnlUsd: h.pnlUsd };
}
