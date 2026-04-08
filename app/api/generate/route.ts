import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `你是一个顶级产品发明家和趋势分析师。用户会给你一个时事热点或痛点，你需要构思一个创新产品发明。

要求：
1. 产品必须紧跟当前趋势，解决真实痛点
2. 需要有创意，不是简单的现有产品改造
3. 考虑可制造性和市场可行性
4. 评分标准：创新度(30%) + 市场潜力(25%) + 可行性(25%) + 趋势契合度(20%)

只返回纯JSON，不要任何其他文字、markdown标记或代码块。
JSON格式：
{
  "title": "产品名称（中文，简洁有力）",
  "tagline": "一句话卖点（15字以内）",
  "trend": "相关的具体趋势现象",
  "trendSource": "趋势来源（如 Google Trends / Twitter / Reddit / 新闻）",
  "painPoint": "用户痛点的详细描述（50-80字）",
  "solution": "解决方案的详细描述，包含产品形态、核心功能、使用场景（80-120字）",
  "category": "产品分类（从以下选择：科技周边/应急科技/健康科技/生活方式/教育工具/宠物用品/户外运动/办公效率/环保科技/食品创新）",
  "score": 75,
  "imagePrompt": "英文产品概念图描述，适合AI图像生成（50-80 words, product photography style）",
  "marketSize": "目标市场规模估算",
  "targetPrice": "建议零售价（如 $29.99）",
  "highlights": ["核心亮点1", "核心亮点2", "核心亮点3", "核心亮点4"]
}`;

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "请提供有效的话题" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `基于这个热点/痛点，发明一个创新产品：${topic}`,
        },
      ],
    });

    const text = message.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");
    const clean = text.replace(/```json|```/g, "").trim();
    const inventionData = JSON.parse(clean);

    // Save to database
    const invention = await prisma.invention.create({
      data: {
        title: inventionData.title,
        tagline: inventionData.tagline,
        trend: inventionData.trend,
        trendSource: inventionData.trendSource,
        painPoint: inventionData.painPoint,
        solution: inventionData.solution,
        category: inventionData.category,
        status: "概念阶段",
        score: Math.min(99, Math.max(30, inventionData.score || 75)),
        imagePrompt: inventionData.imagePrompt || null,
        marketSize: inventionData.marketSize || null,
        targetPrice: inventionData.targetPrice || null,
        highlights: inventionData.highlights || [],
      },
    });

    return NextResponse.json(invention, { status: 201 });
  } catch (error) {
    console.error("Generation failed:", error);
    return NextResponse.json(
      { error: "生成失败，请稍后重试" },
      { status: 500 }
    );
  }
}
