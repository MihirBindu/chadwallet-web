import { NextResponse } from "next/server";
import { getPositionFor } from "@/lib/mock";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  return NextResponse.json({ position: getPositionFor(address) });
}
