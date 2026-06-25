import TokenDetailClient from "@/components/app/TokenDetailClient";

export default async function TokenDetailPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  return <TokenDetailClient address={address} />;
}
