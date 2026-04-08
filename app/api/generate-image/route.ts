import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { inventionId, prompt } = await req.json();

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `Real product photo of: ${prompt}. IMPORTANT STYLE RULES: This must look like a REAL existing product photographed for Amazon listing. Simple, practical, everyday product. Shot on white seamless background. Natural studio lighting, no dramatic effects. No futuristic or sci-fi elements. No glowing lights or neon. The product should look like something you can buy today in a store. Clean, simple, realistic. iPhone photo quality. No 3D renders.`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const imageUrl = data.data?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json({ error: "No image generated" }, { status: 500 });
    }

    if (inventionId) {
      await prisma.invention.update({
        where: { id: inventionId },
        data: { imageUrl },
      });
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Image generation failed:", error);
    return NextResponse.json({ error: "图片生成失败" }, { status: 500 });
  }
}
