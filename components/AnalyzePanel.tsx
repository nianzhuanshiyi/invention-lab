"use client";

import { useState } from "react";

export default function AnalyzePanel({
  onResult,
  loading,
  setLoading,
}: {
  onResult: (data: any) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
}) {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!url.trim() || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/analyze-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        onResult(data);
      }
    } catch (err) {
      console.error("Analyze failed:", err);
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(107,179,255,0.04), rgba(20,25,35,0.95))",
      border: "1px solid rgba(107,179,255,0.1)", borderRadius: "20px",
      padding: "28px", marginBottom: "16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
        <span style={{ fontSize: "20px" }}>🔍</span>
        <h3 style={{ fontSize: "17px", fontWeight: 700, margin: 0 }}>竞品分析 → 微创新</h3>
      </div>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)", margin: "0 0 18px" }}>
        粘贴亚马逊产品链接，AI分析差评痛点，自动生成改进版产品创意
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          placeholder="粘贴Amazon产品链接，如 https://amazon.com/dp/B0XXXXXX"
          style={{
            flex: 1, padding: "13px 18px", borderRadius: "14px", fontSize: "14px",
            background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)",
            color: "#f0f4f8", fontFamily: "inherit",
          }}
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !url.trim()}
          style={{
            padding: "13px 24px", borderRadius: "14px", fontSize: "14px", fontWeight: 700,
            background: loading ? "rgba(107,179,255,0.1)" : "linear-gradient(135deg, #6bb3ff, #4a90d9)",
            color: loading ? "#6bb3ff" : "#0a0e14",
            border: "none", cursor: loading ? "wait" : "pointer",
            opacity: !url.trim() ? 0.4 : 1,
            whiteSpace: "nowrap", transition: "all 0.3s",
          }}
        >
          {loading ? "🔍 分析中..." : "分析并创新 →"}
        </button>
      </div>

      {result?.original && (
        <div style={{
          marginTop: "18px", padding: "16px", borderRadius: "14px",
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
        }}>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "8px" }}>📦 原产品分析</div>
          <div style={{ fontSize: "14px", color: "#f0f4f8", fontWeight: 600, marginBottom: "6px" }}>{result.original.title}</div>
          <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "10px" }}>
            <span>💰 {result.original.price}</span>
            <span>⭐ {result.original.rating}</span>
            <span>💬 {result.original.totalReviews} 评论</span>
          </div>
          <div style={{ fontSize: "12px", color: "#ff6b6b", lineHeight: 1.6 }}>
            <span style={{ fontWeight: 600 }}>用户痛点：</span>
            {result.original.mainComplaints?.join(" / ")}
          </div>
          {result.competitiveEdge && (
            <div style={{ marginTop: "10px", fontSize: "12px", color: "#00ff88", lineHeight: 1.6 }}>
              <span style={{ fontWeight: 600 }}>💡 改进优势：</span>{result.competitiveEdge}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
