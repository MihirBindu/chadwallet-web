"use client";

import { useState } from "react";
import ScreenHeader from "./ScreenHeader";
import NumericKeypad, { applyKeypadInput } from "./NumericKeypad";
import { useAuth } from "@/lib/AuthContext";

const SOL_PRICE_USD = 85.7;

export default function AmountEntryScreen({
  title,
  avatarLetter,
  unit,
  providerLabel,
  providerIcon,
  actionLabel,
  available,
  onConfirm,
}: {
  title: string;
  avatarLetter?: string;
  unit: "USD" | "TOKEN";
  providerLabel?: string;
  providerIcon?: string;
  actionLabel: string;
  available?: { label: string; amount: string };
  onConfirm: (amount: string) => void;
}) {
  const [amount, setAmount] = useState("0");
  const { requireAuth } = useAuth();

  const solEquivalent = unit === "USD" ? Number(amount) / SOL_PRICE_USD : 0;
  const usdEquivalent = unit === "TOKEN" ? Number(amount) * 0.0075 : 0;

  return (
    <div className="flex flex-col flex-1">
      <ScreenHeader title={title} avatarLetter={avatarLetter} />

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-5xl font-extrabold">
          {unit === "USD" ? `$${amount}` : `${amount}`}
          {unit === "TOKEN" && <span className="text-2xl ml-2 text-cw-text-dim">{title.split(" ").pop()}</span>}
        </div>
        <div className="text-cw-text-dim mt-2">
          {unit === "USD" ? `≈ ${solEquivalent.toFixed(4)} SOL` : `≈ $${usdEquivalent.toFixed(2)}`}
        </div>
      </div>

      <div className="px-4 pb-4">
        {(providerLabel || available) && (
          <div className="flex items-center justify-between rounded-xl bg-cw-panel-2 px-4 py-3 mb-3 text-sm">
            <span className="flex items-center gap-2">
              {providerIcon && <span>{providerIcon}</span>}
              {providerLabel ?? available?.label}
            </span>
            <span className="text-cw-text-dim flex items-center gap-1">
              {available ? available.amount : `${solEquivalent.toFixed(4)} SOL`} ⇅
            </span>
          </div>
        )}

        <button
          onClick={() => {
            if (!requireAuth()) return;
            onConfirm(amount);
          }}
          className="w-full rounded-full bg-cw-green text-cw-navy font-semibold py-3 mb-3"
        >
          {actionLabel}
        </button>

        <NumericKeypad onKey={(k) => setAmount((cur) => applyKeypadInput(cur, k))} />
      </div>
    </div>
  );
}
