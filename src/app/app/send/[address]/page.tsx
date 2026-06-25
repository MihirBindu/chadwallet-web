import SendClient from "@/components/app/SendClient";

export default async function SendPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  return <SendClient address={address} />;
}
