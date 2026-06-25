"use client";

import { useState } from "react";
import ScreenHeader from "./ScreenHeader";
import NumericKeypad, { applyKeypadInput } from "./NumericKeypad";

const SOL_PRICE_USD = 85.7;

export default function LaunchClient() {
  const [step, setStep] = useState<"form" | "acquire">("form");
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [social, setSocial] = useState("");
  const [amount, setAmount] = useState("10");

  if (step === "acquire") {
    const sol = (Number(amount) || 0) / SOL_PRICE_USD;
    return (
      <div className="flex flex-col flex-1">
        <ScreenHeader title={`Acquire ${ticker || "COIN"}`} />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-5xl font-extrabold">${amount}</div>
          <div className="text-cw-text-dim mt-2">≈ {sol.toFixed(4)} SOL</div>
        </div>
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between rounded-xl bg-cw-panel-2 px-4 py-3 mb-3 text-sm">
            <span>📋 Pay SOL</span>
            <span className="text-cw-text-dim">{sol.toFixed(4)} SOL ⇅</span>
          </div>
          <button
            onClick={() =>
              alert(
                `Launch ${name || "your coin"} ($${ticker || "TICKER"}) with $${amount} initial buy — requires a connected Privy wallet + on-chain launch transaction to go live.`
              )
            }
            className="w-full rounded-full bg-cw-green text-cw-navy font-semibold py-3 mb-3"
          >
            Launch Coin
          </button>
          <NumericKeypad onKey={(k) => setAmount((cur) => applyKeypadInput(cur, k))} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <ScreenHeader title="Launch Meme Coin" right={<button aria-label="Delete">🗑</button>} />

      <div className="px-4 flex flex-col gap-4">
        <label className="rounded-2xl border border-dashed border-cw-border bg-cw-panel aspect-square flex items-center justify-center text-cw-text-dim text-sm cursor-pointer">
          Upload image
          <input type="file" accept="image/*" className="hidden" />
        </label>

        <div>
          <div className="text-sm font-semibold mb-1">Name</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. unc"
            className="w-full rounded-xl border border-cw-border bg-cw-panel-2 px-3 py-2.5 outline-none focus:border-cw-green"
          />
        </div>

        <div>
          <div className="text-sm font-semibold mb-1">Ticker</div>
          <input
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="e.g. UNC"
            className="w-full rounded-xl border border-cw-border bg-cw-panel-2 px-3 py-2.5 outline-none focus:border-cw-green"
          />
        </div>

        <div>
          <div className="text-sm font-semibold mb-1">Social Links <span className="text-cw-text-dim font-normal">(optional)</span></div>
          <input
            value={social}
            onChange={(e) => setSocial(e.target.value)}
            placeholder="x.com/yourproject"
            className="w-full rounded-xl border border-cw-border bg-cw-panel-2 px-3 py-2.5 outline-none focus:border-cw-green"
          />
        </div>
      </div>

      <div className="mt-auto px-4 pb-4 pt-4">
        <button
          disabled={!name || !ticker}
          onClick={() => setStep("acquire")}
          className="w-full rounded-full bg-cw-green text-cw-navy font-semibold py-3 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
