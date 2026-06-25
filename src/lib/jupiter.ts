const JUPITER_QUOTE_URL = "https://lite-api.jup.ag/swap/v1/quote";
const SOL_MINT = "So11111111111111111111111111111111111111112";

export async function getJupiterQuote(outputMint: string, amountLamports: number) {
  try {
    const url = `${JUPITER_QUOTE_URL}?inputMint=${SOL_MINT}&outputMint=${outputMint}&amount=${amountLamports}&slippageBps=100`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
