"use client";

import AmountEntryScreen from "@/components/app/AmountEntryScreen";

export default function DepositPage() {
  return (
    <AmountEntryScreen
      title="Deposit SOL"
      avatarLetter="S"
      unit="USD"
      providerLabel="Via MoonPay"
      providerIcon="🟣"
      actionLabel="Deposit"
      onConfirm={(amount) =>
        alert(`Deposit $${amount} via MoonPay — requires a connected Privy wallet + MoonPay API key to go live.`)
      }
    />
  );
}
