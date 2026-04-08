
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { inventionId, prompt } = await req.json();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a product concept image: ${prompt}. Style: clean product photography on white/minimal background, high-end commercial look, studio lighting.`,
                },
              ],
            },
          ],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }),
      }
    );

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);

    if (!imagePart) {
      return NextResponse.json({ error: "No image generated" }, { status: 500 });
    }

    const base64 = imagePart.inlineData.data;
    const imageUrl = `data:image/png;base64,${base64}`;

    if (inventionId) {
      await prisma.invention.update({
        where: { id: inventionId },
        data: { imageUrl },
      });
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Image generation failed:", error);
    console.error("Image generation error details:", JSON.stringify(error));
    return NextResponse.json({ error: "图片生成失败" }, { status: 500 });
  }
}
