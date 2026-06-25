import BottomNav from "@/components/app/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cw-navy md:bg-[radial-gradient(circle_at_50%_0%,_rgba(61,220,132,0.08),_transparent_60%)]">
      {/* On desktop widths this renders as a deliberate phone-mockup frame
          (rounded, bordered, shadowed) rather than the mobile shell sitting
          in stark empty margins. Below the md breakpoint it's unchanged. */}
      <div className="flex-1 max-w-md mx-auto w-full flex flex-col bg-cw-navy md:my-8 md:rounded-[2rem] md:border md:border-cw-border md:shadow-2xl md:overflow-hidden">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}
