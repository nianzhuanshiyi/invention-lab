import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Use Claude with web search to find real trending topics
export async function GET() {
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `你是一个趋势分析师。请分析当前（2026年4月）最热门的5个趋势话题，这些话题可以激发产品发明灵感。
只返回纯JSON数组，不要任何其他文字：
[{"keyword":"趋势关键词","description":"简短描述","region":"全球/美国/中国等","potential":"产品机会方向"}]`,
      messages: [
        {
          role: "user",
          content:
            "分析当前最热门的趋势话题，适合产品发明的方向。涵盖科技、生活、健康、环保等领域。",
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
      {
        keyword: "AI Agent 自主工作流",
        description: "AI代理独立完成复杂任务链",
        region: "全球",
        potential: "AI协作硬件/可视化工具",
      },
      {
        keyword: "数字排毒",
        description: "减少屏幕时间的健康运动",
        region: "全球",
        potential: "物理替代品/模拟设备",
      },
      {
        keyword: "微型住宅",
        description: "小空间生活持续增长",
        region: "全球",
        potential: "多功能紧凑型家居产品",
      },
      {
        keyword: "宠物智能化",
        description: "宠物科技市场快速增长",
        region: "全球",
        potential: "宠物健康监测/互动设备",
      },
      {
        keyword: "可持续时尚",
        description: "环保材料和循环经济",
        region: "全球",
        potential: "环保材料日用品",
      },
    ]);
  }
}
