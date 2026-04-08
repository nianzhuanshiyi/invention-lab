import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const data = [
  {
    title: "USB-Clawd 桌面跳舞摆件",
    tagline: "当AI需要你时，它会跳舞提醒你",
    trend: "Claude Code 爆发式增长",
    trendSource: "Twitter/X Trending",
    painPoint: "开发者长时间等待AI响应，错过确认提示，工作流被打断。",
    solution: "铝合金材质的实体摆件，通过USB连接电脑，当Claude Code需要用户确认时物理跳动提醒。开源硬件设计，可自定义触发条件。",
    category: "科技周边",
    status: "已验证",
    score: 92,
    imagePrompt: "A cute minimalist aluminum robot figurine on a desk next to a MacBook, bouncing, soft studio lighting, product photography",
    marketSize: "$2.4B 桌面科技配件市场",
    targetPrice: "$39.99",
    highlights: ["铝合金材质", "USB即插即用", "开源硬件", "可定制动作"],
    votes: 47,
  },
  {
    title: "AI 断网应急卡",
    tagline: "互联网瘫痪时的离线AI助手",
    trend: "全球网络中断事件频发",
    trendSource: "Google Trends",
    painPoint: "云端AI完全依赖网络，断网时工作者陷入停滞，影响成倍放大。",
    solution: "信用卡大小的边缘AI设备，内置精简LLM和8GB闪存，USB-C连接离线使用基础AI功能。支持文本生成、代码补全、翻译。",
    category: "应急科技",
    status: "概念阶段",
    score: 78,
    imagePrompt: "A credit-card sized sleek matte black device with small OLED screen showing AI chat, USB-C connector, product photography",
    marketSize: "$890M 边缘计算设备",
    targetPrice: "$79.99",
    highlights: ["信用卡大小", "离线运行", "USB-C供电", "基础LLM内置"],
    votes: 23,
  },
  {
    title: "情绪感应水杯",
    tagline: "读懂你的压力，提醒你喝水",
    trend: "职场心理健康关注度飙升",
    trendSource: "Google Trends + Reddit",
    painPoint: "高压工作者忘记喝水、忽视身体信号，传统智能水杯只能定时提醒缺乏个性化。",
    solution: "智能水杯内置心率/皮电传感器，检测握杯时压力水平，杯身LED环变色提示状态。高压时震动提醒饮水休息，App记录21天数据生成报告。",
    category: "健康科技",
    status: "原型设计",
    score: 85,
    imagePrompt: "A futuristic smart water bottle with color-changing LED ring glowing green, minimalist design, office desk, product photography",
    marketSize: "$1.2B 智能饮水设备",
    targetPrice: "$49.99",
    highlights: ["心率检测", "杯身变色", "App联动", "21天习惯养成"],
    votes: 35,
  },
];

async function main() {
  console.log("Seeding...");
  for (const inv of data) {
    await prisma.invention.create({ data: inv });
  }
  console.log("Done: " + (await prisma.invention.count()) + " inventions");
}

main().catch(console.error).finally(() => prisma.$disconnect());
