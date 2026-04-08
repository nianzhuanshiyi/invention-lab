"use client";

import { useState, useEffect, useCallback } from "react";
import { Invention } from "@/lib/types";
import ParticleField from "@/components/ParticleField";
import InventionCard from "@/components/InventionCard";
import GeneratePanel from "@/components/GeneratePanel";
import DetailModal from "@/components/DetailModal";

const CATEGORIES = [
  "全部", "科技周边", "应急科技", "健康科技", "生活方式",
  "教育工具", "宠物用品", "户外运动", "办公效率", "环保科技", "食品创新",
];

const SORT_OPTIONS = [
  { value: "newest", label: "最新" },
  { value: "score", label: "评分" },
  { value: "votes", label: "热门" },
];

export default function Home() {
  const [inventions, setInventions] = useState<Invention[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [category, setCategory] = useState("全部");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState<Invention | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchInventions = useCallback(async () => {
    try {
      const params = new URLSearchParams({ sort });
      if (category !== "全部") params.set("category", category);
      const res = await fetch(`/api/inventions?${params}`);
      const data = await res.json();
      setInventions(data);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setFetching(false);
    }
  }, [category, sort]);

  useEffect(() => {
    fetchInventions();
  }, [fetchInventions]);

  useEffect(() => {
    fetch("/api/trends")
      .then((r) => r.json())
      .then(setTrends)
      .catch(() => {});
  }, []);

  const handleGenerate = async (topic: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      if (res.ok) {
        const newInv = await res.json();
        setInventions((prev) => [newInv, ...prev]);
      }
    } catch (err) {
      console.error("Generate failed:", err);
    }
    setLoading(false);
  };

  const handleVote = async (id: string) => {
    try {
      const res = await fetch(`/api/inventions/${id}/vote`, { method: "POST" });
      if (res.ok) {
        const { votes } = await res.json();
        setInventions((prev) =>
          prev.map((inv) => (inv.id === id ? { ...inv, votes } : inv))
        );
        if (selected?.id === id) setSelected((s) => s ? { ...s, votes } : s);
      }
    } catch (err) {
      console.error("Vote failed:", err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <ParticleField />

      {/* Nav */}
      <nav
        style={{
          position: "sticky", top: 0, zIndex: 100,
          padding: "14px 32px",
          background: "rgba(10,14,20,0.85)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px", height: "34px", borderRadius: "10px",
              background: "linear-gradient(135deg, #00ff88, #00aa55)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px",
            }}
          >
            ⚡
          </div>
          <span className="gradient-text" style={{ fontSize: "17px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            InventionLab
          </span>
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {inventions.length} 个发明
          </span>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#00ff88", animation: "pulse-glow 2s ease infinite" }} />
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px 80px", position: "relative", zIndex: 1 }}>
        {/* Hero */}
        <div className="animate-fade-up" style={{ textAlign: "center", padding: "48px 0 40px" }}>
          <div
            style={{
              display: "inline-block", padding: "5px 16px", borderRadius: "100px",
              background: "var(--accent-dim)", border: "1px solid rgba(0,255,136,0.15)",
              fontSize: "11px", color: "#00ff88", fontWeight: 600, letterSpacing: "1px",
              textTransform: "uppercase", marginBottom: "20px",
            }}
          >
            🔬 趋势驱动的产品发明平台
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5.5vw, 58px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 14px", letterSpacing: "-1.5px" }}>
            <span>从热点到</span>
            <span className="gradient-text">发明</span>
          </h1>
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
            捕捉全球趋势 → 发现用户痛点 → AI生成产品概念 → 可视化呈现
          </p>
        </div>

        {/* Generator */}
        <GeneratePanel onGenerate={handleGenerate} loading={loading} trends={trends} />

        {/* Filters */}
        <div
          className="animate-fade-up"
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: "12px", marginBottom: "28px",
          }}
        >
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`cat-pill ${category === cat ? "active" : ""}`}
                style={{
                  padding: "7px 15px", borderRadius: "100px", fontSize: "12px", fontWeight: 600,
                  background: category === cat ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.03)",
                  color: category === cat ? "#00ff88" : "var(--text-muted)",
                  border: `1px solid ${category === cat ? "rgba(0,255,136,0.3)" : "var(--border)"}`,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                style={{
                  padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: 600,
                  background: sort === opt.value ? "rgba(255,255,255,0.08)" : "transparent",
                  color: sort === opt.value ? "var(--text-primary)" : "var(--text-muted)",
                  border: "none", cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {fetching ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div className="shimmer-bg" style={{ display: "inline-block", padding: "12px 24px", borderRadius: "12px", color: "var(--text-muted)", fontSize: "14px" }}>
              加载中...
            </div>
          </div>
        ) : inventions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)", fontSize: "14px" }}>
            暂无发明，用上方生成器创建第一个吧！
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "18px" }}>
            {inventions.map((inv, i) => (
              <InventionCard key={inv.id} invention={inv} index={i} onClick={setSelected} onVote={handleVote} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "80px", padding: "28px 0", borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>InventionLab — 趋势驱动的AI产品发明平台</p>
          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.1)", marginTop: "6px" }}>数据来源: Google Trends · Twitter/X · Reddit · 行业报告</p>
        </div>
      </div>

      <DetailModal invention={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
