import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InventionLab — 趋势驱动的AI产品发明平台",
  description: "捕捉全球趋势，发现用户痛点，AI生成产品发明概念",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
