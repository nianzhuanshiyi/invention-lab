import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `你是一个专注亚马逊小商品的产品创新顾问。用户会给你一个生活痛点或趋势，你需要构思一个适合在亚马逊销售的小而美的创新产品。

核心约束（必须严格遵守）：
1. 产品必须是实体小件商品，可手持或桌面放置，便于FBA发货
2. 售价必须在 $15-$100 之间
3. 不要发明黑科技或高精尖产品，要基于现有技术做微创新
4. 创新方式：改进材质、增加一个巧妙功能、解决被忽视的痛点、组合两个已有产品
5. 要有清晰的目标用户画像（谁会买、在什么场景下用）
6. 参考成功案例思路：更好的手机支架、带温度显示的水杯、可折叠的桌面收纳、宠物自动喂食器改进版

好的发明特征：
- 看到就理解用途（不需要复杂说明）
- 解决一个具体的、高频的、日常痛点
- 成本可控（生产成本控制在售价的20-30%）
- 有差异化卖点（比竞品好在哪里，一句话说清楚）
- 适合拍出好看的产品图和视频

不好的发明：
- 需要APP配合才能用的复杂智能设备
- 售价超过$100的高端产品
- 需要专利授权的技术
- 市场太小众（月搜索量低于1000）

只返回纯JSON，不要任何其他文字、markdown标记或代码块。
JSON格式：
{
  "title": "产品名称（中文，简洁易懂，像亚马逊listing标题风格）",
  "tagline": "一句话卖点（15字以内，消费者看到就想买）",
  "trend": "相关的具体趋势或痛点现象",
  "trendSource": "趋势来源（Google Trends / Reddit / TikTok / Amazon评论）",
  "painPoint": "用户痛点描述：谁、在什么场景、遇到什么问题、现有方案为什么不够好（60-80字）",
  "solution": "产品描述：外观形态、核心功能、使用方式、跟现有产品的区别（80-100字）",
  "category": "从以下选择：厨房用品/家居收纳/办公桌面/个人护理/宠物用品/户外便携/运动健身/汽车配件/母婴用品/手机配件",
  "score": 75,
  "imagePrompt": "英文产品描述，用于生成产品图。要求：描述一个真实存在的、可以在亚马逊买到的产品外观。包含材质、颜色、大小参考。不要科幻元素，不要发光效果。像手机拍的实物照片。(40-60 words)",
  "marketSize": "预估亚马逊月搜索量和市场规模",
  "targetPrice": "建议售价（$15-$100之间）",
  "highlights": ["差异化卖点1", "差异化卖点2", "差异化卖点3", "差异化卖点4"]
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
