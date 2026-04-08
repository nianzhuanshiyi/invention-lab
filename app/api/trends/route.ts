import { NextResponse } from "next/server";

const SELLERSPRITE_MCP = "https://mcp.sellersprite.com/mcp?secret-key=51e2c0ecdc3c497b85f35865d8d28b6d";

export async function GET() {
  try {
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
        max_tokens: 2000,
        mcp_servers: [
          { type: "url", url: SELLERSPRITE_MCP, name: "sellersprite" }
        ],
        system: `你是亚马逊选品趋势分析师。请使用卖家精灵的工具获取真实数据：

1. 先用 google_trend 工具查询3-5个跟日常生活小商品相关的关键词的趋势（如 desk organizer, pet toy, phone stand, kitchen gadget, cable organizer），市场选US
2. 根据趋势数据，分析哪些品类在上升

然后返回5个最有潜力的产品方向。

最终只返回纯JSON数组，格式：
[{"keyword":"趋势关键词","description":"为什么这个趋势在上升","region":"US","potential":"可以做什么$15-100的小产品","searchTrend":"上升/稳定/爆发","dataSource":"Google Trends via SellerSprite"}]

只返回JSON，不要其他文字。`,
        messages: [
          { role: "user", content: "请分析当前亚马逊小商品的热门趋势，使用卖家精灵工具获取真实Google Trends数据和亚马逊搜索数据。" }
        ],
      }),
    });

    const data = await response.json();

    // Extract text from response (may have tool use blocks)
    const textBlocks = data.content?.filter((b: any) => b.type === "text") || [];
    const text = textBlocks.map((b: any) => b.text).join("");

    // Try to parse JSON from the text
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const trends = JSON.parse(jsonMatch[0]);
      return NextResponse.json(trends);
    }

    throw new Error("No valid JSON in response");
  } catch (error) {
    console.error("Trends fetch failed:", error);
    return NextResponse.json([
      { keyword: "久坐办公腰酸背痛", description: "长时间坐办公桌导致腰部不适", region: "US", potential: "便携腰部支撑垫/坐姿矫正器", searchTrend: "上升", dataSource: "fallback" },
      { keyword: "冰箱食物过期浪费", description: "食物放冰箱忘记吃导致浪费", region: "US", potential: "智能食物日期标签/冰箱收纳盒", searchTrend: "稳定", dataSource: "fallback" },
      { keyword: "宠物独自在家焦虑", description: "上班族的猫狗独处时间长", region: "US", potential: "自动逗猫器/宠物陪伴玩具", searchTrend: "上升", dataSource: "fallback" },
      { keyword: "数据线桌面凌乱", description: "各种充电线在桌上缠绕混乱", region: "US", potential: "磁吸理线器/多合一充电底座", searchTrend: "上升", dataSource: "fallback" },
      { keyword: "户外水杯保温差", description: "徒步露营时水杯保温不够", region: "US", potential: "超长保温杯/带滤网户外水壶", searchTrend: "稳定", dataSource: "fallback" },
    ]);
  }
}
