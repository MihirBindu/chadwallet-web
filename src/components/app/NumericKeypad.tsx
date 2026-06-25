"use client";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"];

export default function NumericKeypad({
  onKey,
}: {
  onKey: (key: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-px text-2xl font-medium select-none">
      {KEYS.map((k) => (
        <button
          key={k}
          onClick={() => onKey(k)}
          className="py-4 flex items-center justify-center text-foreground active:bg-cw-panel-2 rounded-xl"
        >
          {k === "back" ? "⌫" : k}
        </button>
      ))}
    </div>
  );
}

export function applyKeypadInput(current: string, key: string): string {
  if (key === "back") return current.length <= 1 ? "0" : current.slice(0, -1);
  if (key === ".") return current.includes(".") ? current : `${current}.`;
  if (current === "0") return key;
  return `${current}${key}`;
}
