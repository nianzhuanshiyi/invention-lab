import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SELLERSPRITE_MCP = "https://mcp.sellersprite.com/mcp?secret-key=51e2c0ecdc3c497b85f35865d8d28b6d";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "请提供链接" }, { status: 400 });

    // Step 1: Extract ASIN if it's an Amazon link
    const asinMatch = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i) || url.match(/([A-Z0-9]{10})/);
    const isAmazon = url.includes("amazon.com") || url.includes("amazon.co");

    let analysisPrompt = "";
    let useMcp = false;

    if (isAmazon && asinMatch) {
      useMcp = true;
      analysisPrompt = `请分析这个Amazon产品并构思改进版本：

1. 先用 asin_detail 工具查询 ASIN: ${asinMatch[1]}，市场选US，获取产品详情（标题、价格、评分、卖点等）
2. 再用 review 工具查询这个ASIN的差评（1-3星），市场选US，找出用户痛点和不满
3. 用 keyword_research 查询相关关键词的搜索量

基于以上真实数据，构思一个改进版产品。改进方向：
- 解决差评中提到的核心痛点
- 保持在$15-100售价区间
- 要有明确的差异化卖点
- 适合亚马逊FBA销售

返回纯JSON：
{
  "originalProduct": {
    "title": "原产品标题",
    "price": "原产品价格",
    "rating": "评分",
    "totalReviews": "评论数",
    "mainComplaints": ["差评痛点1", "差评痛点2", "差评痛点3"]
  },
  "improvedProduct": {
    "title": "改进版产品名称（中文）",
    "tagline": "一句话卖点（15字以内）",
    "trend": "基于原产品差评和市场需求",
    "trendSource": "Amazon评论分析 + 卖家精灵数据",
    "painPoint": "原产品的核心痛点（从真实差评中提取）",
    "solution": "改进方案详细描述（如何解决痛点、跟原产品的区别）",
    "category": "产品分类",
    "score": 80,
    "imagePrompt": "英文产品图描述，真实产品照片风格，白色背景，亚马逊listing风格(40-60 words)",
    "marketSize": "基于关键词搜索量的市场规模",
    "targetPrice": "建议售价($15-100)",
    "highlights": ["改进亮点1", "改进亮点2", "改进亮点3", "改进亮点4"],
    "competitiveEdge": "对比原产品的核心优势"
  }
}`;
    } else {
      // Non-Amazon URL: use Anthropic to analyze the page
      analysisPrompt = `请分析这个产品链接：${url}

这是一个产品页面。请：
1. 根据链接推测产品类型和功能
2. 思考这类产品的常见痛点和用户不满
3. 构思一个改进版本，适合在亚马逊销售

返回纯JSON：
{
  "originalProduct": {
    "title": "原产品推测名称",
    "price": "推测价格",
    "rating": "未知",
    "totalReviews": "未知",
    "mainComplaints": ["可能的痛点1", "可能的痛点2", "可能的痛点3"]
  },
  "improvedProduct": {
    "title": "改进版产品名称（中文）",
    "tagline": "一句话卖点（15字以内）",
    "trend": "基于产品分析",
    "trendSource": "产品链接分析",
    "painPoint": "推测的核心痛点",
    "solution": "改进方案详细描述",
    "category": "产品分类",
    "score": 75,
    "imagePrompt": "英文产品图描述，真实产品照片风格，白色背景(40-60 words)",
    "marketSize": "待验证",
    "targetPrice": "建议售价($15-100)",
    "highlights": ["改进亮点1", "改进亮点2", "改进亮点3", "改进亮点4"],
    "competitiveEdge": "对比原产品的核心优势"
  }
}`;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    };

    const body: any = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      system: "你是亚马逊产品创新专家。分析现有产品，找出痛点，构思改进版本。只返回纯JSON。",
      messages: [{ role: "user", content: analysisPrompt }],
    };

    if (useMcp) {
      headers["anthropic-beta"] = "mcp-client-2025-04-04";
      body.mcp_servers = [{ type: "url", url: SELLERSPRITE_MCP, name: "sellersprite" }];
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const textBlocks = data.content?.filter((b: any) => b.type === "text") || [];
    const text = textBlocks.map((b: any) => b.text).join("");
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json({ error: "分析失败，未获取到有效数据" }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    const improved = result.improvedProduct;

    // Save the improved product to database
    const invention = await prisma.invention.create({
      data: {
        title: improved.title,
        tagline: improved.tagline,
        trend: improved.trend,
        trendSource: improved.trendSource,
        painPoint: improved.painPoint,
        solution: improved.solution,
        category: improved.category || "产品改进",
        status: "基于竞品分析",
        score: improved.score || 75,
        imagePrompt: improved.imagePrompt || null,
        marketSize: improved.marketSize || null,
        targetPrice: improved.targetPrice || null,
        highlights: improved.highlights || [],
      },
    });

    return NextResponse.json({
      original: result.originalProduct,
      invention,
      competitiveEdge: improved.competitiveEdge,
    });
  } catch (error) {
    console.error("URL analysis failed:", error);
    return NextResponse.json({ error: "分析失败，请稍后重试" }, { status: 500 });
  }
}
