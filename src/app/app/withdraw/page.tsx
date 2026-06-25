"use client";

import AmountEntryScreen from "@/components/app/AmountEntryScreen";

export default function WithdrawPage() {
  return (
    <AmountEntryScreen
      title="Withdraw SOL"
      avatarLetter="S"
      unit="USD"
      providerLabel="Via MoonPay"
      providerIcon="🟣"
      actionLabel="Withdraw"
      onConfirm={(amount) =>
        alert(`Withdraw $${amount} via MoonPay — requires a connected Privy wallet + MoonPay API key to go live.`)
      }
    />
  );
}
