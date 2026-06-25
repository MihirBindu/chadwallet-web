export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[2rem] border border-cw-border bg-cw-navy aspect-[4/5] p-3 shadow-2xl overflow-hidden">
      <div className="h-full w-full rounded-2xl bg-cw-navy border border-cw-border/60 overflow-hidden flex flex-col text-foreground">
        <div className="flex items-center justify-between px-3 pt-2 text-[10px] text-cw-text-dim">
          <span>9:41</span>
          <span>📶 🔋</span>
        </div>
        <div className="flex-1 px-3 pb-3 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
