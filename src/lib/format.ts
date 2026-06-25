export function fmtUsdShort(n: number) {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(2)}K`;
  return `${sign}$${abs.toFixed(2)}`;
}

export function fmtPrice(n: number) {
  if (n >= 1) return `$${n.toFixed(2)}`;
  if (n >= 0.01) return `$${n.toFixed(4)}`;
  // subscript leading zero count, e.g. $0.0_4 2725
  const str = n.toFixed(10).replace(/^0\./, "");
  const match = str.match(/^(0*)(\d+)/);
  if (!match) return `$${n}`;
  const zeros = match[1].length;
  const digits = match[2].slice(0, 4);
  return `$0.0${zeros > 0 ? `(${zeros})` : ""}${digits}`;
}

export function shortAddr(a: string) {
  return `${a.slice(0, 6)}`;
}

export function fmtCompact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}
