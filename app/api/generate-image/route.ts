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
        prompt: `Simple product photo for Amazon: ${prompt}. CRITICAL RULES: This is a simple everyday product, NOT a tech gadget. Must look like a real photo taken with an iPhone. Plain white background. No metallic shine, no LED lights, no futuristic elements, no sci-fi design. Think dollar store or Target product quality. Matte materials. Simple shapes. The kind of product a normal person uses daily. NO 3D RENDER LOOK.`,
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
