import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "newest";

  const where = category && category !== "全部" ? { category } : {};
  const orderBy =
    sort === "votes"
      ? { votes: "desc" as const }
      : sort === "score"
      ? { score: "desc" as const }
      : { createdAt: "desc" as const };

  const inventions = await prisma.invention.findMany({
    where,
    orderBy,
    take: 50,
  });

  return NextResponse.json(inventions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const invention = await prisma.invention.create({
    data: {
      title: body.title,
      tagline: body.tagline,
      trend: body.trend,
      trendSource: body.trendSource,
      painPoint: body.painPoint,
      solution: body.solution,
      category: body.category,
      status: body.status || "概念阶段",
      score: body.score || 75,
      imagePrompt: body.imagePrompt || null,
      imageUrl: body.imageUrl || null,
      marketSize: body.marketSize || null,
      targetPrice: body.targetPrice || null,
      highlights: body.highlights || [],
    },
  });

  return NextResponse.json(invention, { status: 201 });
}
