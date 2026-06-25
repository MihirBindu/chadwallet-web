import Header from "@/components/Header";
import TradingClient from "@/components/TradingClient";

export default async function TradePage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <TradingClient address={address} />
    </div>
  );
}
