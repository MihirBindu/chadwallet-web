import ResearchClient from "@/components/app/ResearchClient";

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  return <ResearchClient address={address} />;
}
