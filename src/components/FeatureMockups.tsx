export function DepositMockup() {
  return (
    <div className="flex flex-col h-full text-xs">
      <div className="flex items-center gap-2 font-semibold mb-4">
        <span>←</span>
        <span className="h-5 w-5 rounded-full bg-cw-panel-2 flex items-center justify-center text-[10px] text-cw-green">S</span>
        Deposit SOL
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-3xl font-extrabold">$20</div>
        <div className="text-cw-text-dim mt-1">≈ 0.2334 SOL</div>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-cw-panel-2 px-2 py-1.5 mb-2 text-[10px]">
        <span>🟣 Via MoonPay</span>
        <span className="text-cw-text-dim">0.2334 SOL ⇅</span>
      </div>
      <div className="rounded-full bg-cw-green text-cw-navy text-center font-semibold py-1.5 mb-2 text-[11px]">
        Deposit
      </div>
      <div className="grid grid-cols-3 gap-1 text-center text-[10px] text-cw-text-dim">
        {["1", "2", "3", "4", "5", "6"].map((k) => (
          <span key={k} className="py-1 rounded bg-cw-panel-2/50">
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}

export function KolFeedMockup() {
  const rows = [
    { name: "Roman", side: "sold", amt: "$100.41", token: "Disabled Alpha", price: "$0.04272", down: true },
    { name: "Zrool", side: "sold", amt: "$142.10", token: "A Better Future", price: "$0.05496", down: true },
    { name: "Cupsey", side: "bought", amt: "$124.32", token: "A Better Future", price: "$0.05496", down: false },
  ];
  return (
    <div className="flex flex-col h-full text-xs gap-3">
      <div className="rounded-full bg-cw-panel-2 px-2 py-1 text-[10px] text-cw-text-dim flex items-center gap-1">
        🔍 Tokens, wallets, #tweets
      </div>
      <div className="flex items-center gap-3 text-[10px] font-medium text-cw-text-dim">
        <span>Live</span>
        <span className="text-cw-green">● KOLs</span>
        <span>Trending</span>
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((r, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-[10px]">
              <span className="h-4 w-4 rounded-full bg-cw-panel-2 flex items-center justify-center">{r.name[0]}</span>
              <span className="font-semibold">{r.name}</span>
              <span className={r.side === "sold" ? "text-cw-red" : "text-cw-green"}>{r.side}</span>
              <span>{r.amt}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-cw-panel px-2 py-1.5 border border-cw-border">
              <span className="text-[10px] font-medium truncate">{r.token}</span>
              <span className="text-[10px] text-cw-text-dim">{r.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TopTraderMockup() {
  return (
    <div className="flex flex-col h-full text-xs">
      <div className="flex items-center gap-2 font-semibold mb-3">
        <span>←</span>
        <span className="h-5 w-5 rounded-full bg-cw-panel-2 flex items-center justify-center text-[10px]">J</span>
        jijo
      </div>
      <div className="text-cw-green font-extrabold text-2xl">▲ $2.49M</div>
      <div className="text-cw-green text-[10px] mb-3">▲ $3.01K (1.59%) Today</div>
      <svg viewBox="0 0 200 60" className="w-full h-14 mb-3">
        <polyline
          fill="none"
          stroke="#3ddc84"
          strokeWidth="2"
          points="0,55 20,48 40,45 60,38 80,32 100,30 120,22 140,18 160,10 180,6 200,2"
        />
      </svg>
      <div className="grid grid-cols-2 gap-2 text-[10px] mb-3">
        <div className="rounded-lg bg-cw-panel-2 px-2 py-1.5">
          <div className="text-cw-text-dim">Win rate</div>
          <div className="font-semibold">68.5%</div>
        </div>
        <div className="rounded-lg bg-cw-panel-2 px-2 py-1.5">
          <div className="text-cw-text-dim">Total PnL</div>
          <div className="font-semibold text-cw-green">$4.31M</div>
        </div>
      </div>
      <div className="rounded-full bg-cw-green text-cw-navy text-center font-semibold py-1.5 text-[11px] mt-auto">
        Send
      </div>
    </div>
  );
}

export function LaunchCoinMockup() {
  return (
    <div className="flex flex-col h-full text-xs">
      <div className="flex items-center justify-between font-semibold mb-3">
        <span className="flex items-center gap-2">
          <span>←</span> Launch Meme Coin
        </span>
        <span>🗑</span>
      </div>
      <div className="rounded-xl border border-dashed border-cw-border bg-cw-panel-2 flex-1 mb-3 flex items-center justify-center text-cw-text-dim text-[10px]">
        upload image
      </div>
      <div className="flex flex-col gap-2 mb-3">
        <div>
          <div className="text-[10px] text-cw-text-dim mb-0.5">Name</div>
          <div className="rounded-lg bg-cw-panel-2 px-2 py-1 text-[11px]">unc</div>
        </div>
        <div>
          <div className="text-[10px] text-cw-text-dim mb-0.5">Ticker</div>
          <div className="rounded-lg bg-cw-panel-2 px-2 py-1 text-[11px]">UNC</div>
        </div>
      </div>
      <div className="rounded-full bg-cw-green text-cw-navy text-center font-semibold py-1.5 text-[11px]">
        Next
      </div>
    </div>
  );
}

export function AssetsMockup() {
  return (
    <div className="flex flex-col h-full text-xs">
      <div className="rounded-full bg-cw-panel-2 px-2 py-1 text-[10px] text-cw-text-dim flex items-center gap-1 mb-3">
        🔍 Search for tokens or wallets
      </div>
      <div className="text-2xl font-extrabold">$773.98</div>
      <div className="text-cw-green text-[10px] mb-3">▲ $773.99 Past year</div>
      <svg viewBox="0 0 200 50" className="w-full h-12 mb-3">
        <polyline fill="none" stroke="#3ddc84" strokeWidth="2" points="0,48 40,48 60,10 120,8 200,4" />
      </svg>
      <div className="grid grid-cols-4 gap-1 text-center text-[9px] mb-3">
        {["Send", "Receive", "Deposit", "Withdraw"].map((l) => (
          <div key={l} className="flex flex-col items-center gap-1">
            <span className="h-6 w-6 rounded-full bg-cw-green text-cw-navy flex items-center justify-center text-[10px]">
              •
            </span>
            {l}
          </div>
        ))}
      </div>
      <div className="rounded-full bg-cw-green/15 border border-cw-green/40 text-cw-green text-center text-[10px] font-medium py-1.5">
        🎁 Earn rewards
      </div>
    </div>
  );
}
