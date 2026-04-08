import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { inventionId, basePrompt } = await req.json();

    const angles = [
      { name: "主图", suffix: "Front view, centered on pure white background, hero shot for Amazon listing, studio lighting" },
      { name: "使用场景", suffix: "In-use lifestyle shot, person using the product in natural home/office setting, warm lighting, realistic photography" },
      { name: "细节特写", suffix: "Close-up detail shot showing texture, material quality, and key feature, macro photography style" },
      { name: "包装展示", suffix: "Product with packaging box, gift-ready presentation, clean white background, showing product name and features on box" },
    ];

    const results = [];

    for (const angle of angles) {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: `Real product photo: ${basePrompt}. ${angle.suffix}. IMPORTANT: Must look like a real product that exists today. No sci-fi, no futuristic elements. Simple, practical, everyday item.`,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        }),
      });

      const data = await response.json();
      if (data.data?.[0]?.url) {
        results.push({ name: angle.name, url: data.data[0].url });
      }
    }

    if (inventionId && results.length > 0) {
      await prisma.invention.update({
        where: { id: inventionId },
        data: { imageUrl: results[0].url },
      });
    }

    return NextResponse.json({ images: results });
  } catch (error) {
    console.error("Multi-image generation failed:", error);
    return NextResponse.json({ error: "图片生成失败" }, { status: 500 });
  }
}
