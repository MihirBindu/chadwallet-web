export default function PriceRangeBar({ low, high }: { low: number; high: number }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      <span className="text-cw-green whitespace-nowrap">${low.toFixed(low < 1 ? 4 : 2)}</span>
      <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-cw-green to-cw-red" />
      <span className="text-cw-red whitespace-nowrap">${high.toFixed(high < 1 ? 4 : 2)}</span>
    </div>
  );
}
