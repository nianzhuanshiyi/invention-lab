import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const invention = await prisma.invention.update({
    where: { id },
    data: { votes: { increment: 1 } },
  });
  return NextResponse.json({ votes: invention.votes });
}
