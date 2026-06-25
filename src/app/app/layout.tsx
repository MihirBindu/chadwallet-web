import BottomNav from "@/components/app/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cw-navy">
      <div className="flex-1 max-w-md mx-auto w-full flex flex-col">{children}</div>
      <BottomNav />
    </div>
  );
}
