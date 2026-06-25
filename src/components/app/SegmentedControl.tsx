"use client";

export default function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 text-sm font-medium overflow-x-auto cw-scrollbar-none">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`whitespace-nowrap pb-1 border-b-2 transition ${
            value === opt ? "text-cw-green border-cw-green" : "text-cw-text-dim border-transparent"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
