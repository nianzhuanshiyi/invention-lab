import { NextRequest, NextResponse } from "next/server";

const SELLERSPRITE_MCP = "https://mcp.sellersprite.com/mcp?secret-key=51e2c0ecdc3c497b85f35865d8d28b6d";

export async function POST(req: NextRequest) {
  try {
    const { title, category, keywords } = await req.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "mcp-client-2025-04-04",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 3000,
        mcp_servers: [
          { type: "url", url: SELLERSPRITE_MCP, name: "sellersprite" }
        ],
        system: `你是亚马逊市场分析师。用户给你一个产品发明概念，请用卖家精灵工具进行市场验证：

1. 用 keyword_research 查询相关关键词的月搜索量、竞争度
2. 用 google_trend 查看搜索趋势是否在上升
3. 如果能找到相关类目，用 product_research 看看类似产品的价格区间和月销量

基于数据给出市场评估，只返回JSON：
{
  "verdict": "值得做/谨慎考虑/不建议",
  "score": 75,
  "searchVolume": "月搜索量数据",
  "competition": "竞争程度描述",
  "pricingRange": "现有类似产品价格区间",
  "trendDirection": "上升/稳定/下降",
  "topCompetitors": ["竞品1", "竞品2"],
  "advice": "具体建议，100字以内",
  "rawKeywords": [{"keyword": "xxx", "monthlySearch": 5000, "competition": "中等"}]
}`,
        messages: [
          { role: "user", content: `请验证这个产品发明的市场可行性：\n产品名：${title}\n类目：${category}\n相关关键词：${keywords || title}` }
        ],
      }),
    });

    const data = await response.json();
    const textBlocks = data.content?.filter((b: any) => b.type === "text") || [];
    const text = textBlocks.map((b: any) => b.text).join("");
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return NextResponse.json(JSON.parse(jsonMatch[0]));
    }

    return NextResponse.json({ error: "解析失败" }, { status: 500 });
  } catch (error) {
    console.error("Market check failed:", error);
    return NextResponse.json({ error: "市场验证失败" }, { status: 500 });
  }
}
