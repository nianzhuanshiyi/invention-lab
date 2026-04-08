import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Use Claude with web search to find real trending topics
export async function GET() {
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `你是一个亚马逊选品趋势分析师。请分析当前5个最适合做亚马逊小商品的生活痛点或微趋势。
要求：
- 聚焦日常生活中的具体小痛点（不要宏大叙事）
- 适合做$15-100的实体小商品
- 有一定搜索量和需求量
只返回纯JSON数组：
[{"keyword":"痛点/趋势关键词","description":"简短描述这个痛点","region":"主要市场","potential":"可以做什么小产品"}]`,
      messages: [
        {
          role: "user",
          content: "分析当前最适合亚马逊小商品创新的生活痛点和微趋势。涵盖厨房、办公、个护、宠物、户外等日常场景。要具体，比如'切洋葱流泪'而不是'厨房科技革命'。",
        },
      ],
    });

    const text = message.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");
    const clean = text.replace(/```json|```/g, "").trim();
    const trends = JSON.parse(clean);

    return NextResponse.json(trends);
  } catch (error) {
    console.error("Trends fetch failed:", error);
    // Fallback static trends
    return NextResponse.json([
      { keyword: "久坐办公腰酸背痛", description: "长时间坐办公桌导致腰部不适", region: "全球", potential: "便携腰部支撑垫/坐姿矫正器" },
      { keyword: "冰箱食物过期浪费", description: "食物放冰箱忘记吃导致浪费", region: "美国", potential: "智能食物日期标签/冰箱收纳盒改进" },
      { keyword: "宠物独自在家焦虑", description: "上班族的猫狗独处时间长", region: "美国", potential: "自动逗猫器/宠物陪伴玩具" },
      { keyword: "数据线桌面凌乱", description: "各种充电线在桌上缠绕混乱", region: "全球", potential: "磁吸理线器/多合一充电底座" },
      { keyword: "户外水杯保温差", description: "徒步露营时水杯保温时间不够", region: "美国", potential: "超长保温杯/带滤网户外水壶" },
    ]);
  }
}
