export function fmtUsdShort(n: number) {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(2)}K`;
  return `${sign}$${abs.toFixed(2)}`;
}

const SUBSCRIPT_DIGITS = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];

function toSubscript(num: number) {
  return String(num)
    .split("")
    .map((d) => SUBSCRIPT_DIGITS[Number(d)] ?? d)
    .join("");
}

export function fmtPrice(n: number) {
  if (n >= 1) return `$${n.toFixed(2)}`;
  if (n >= 0.01) return `$${n.toFixed(4)}`;
  // e.g. $0.0₄2725 — matches the leading-zero-count convention used by
  // DexScreener/Phantom/etc for very small token prices.
  const str = n.toFixed(12).replace(/^0\./, "");
  const match = str.match(/^(0*)(\d+)/);
  if (!match) return `$${n}`;
  const zeros = match[1].length;
  const digits = match[2].slice(0, 4) || "0";
  return `$0.0${zeros > 0 ? toSubscript(zeros) : ""}${digits}`;
}

export function shortAddr(a: string) {
  return `${a.slice(0, 6)}`;
}

export function fmtCompact(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

const AVATAR_PALETTE = ["#3ddc84", "#4fc3ff", "#ff9f4f", "#c792ff", "#ff5c8a", "#5ce0c6"];

export function tokenColor(symbol: string) {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) hash = (hash * 31 + symbol.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}
