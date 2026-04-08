"use client";
import { useState } from "react";

interface TrendItem {
  keyword: string;
  description: string;
  region: string;
  potential: string;
}

export default function GeneratePanel({
  onGenerate,
  loading,
  trends,
}: {
  onGenerate: (topic: string) => void;
  loading: boolean;
  trends: TrendItem[];
}) {
  const [topic, setTopic] = useState("");

  const handleSubmit = () => {
    if (topic.trim() && !loading) {
      onGenerate(topic.trim());
      setTopic("");
    }
  };

  return (
    <div style={{ marginBottom: "40px" }}>
      {/* Generator input */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(0,255,136,0.04), rgba(20,25,35,0.95))",
          border: "1px solid rgba(0,255,136,0.1)",
          borderRadius: "20px",
          padding: "28px",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <span style={{ fontSize: "20px" }}>⚡</span>
          <h3 style={{ fontSize: "17px", fontWeight: 700, margin: 0 }}>AI 发明生成器</h3>
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 18px" }}>
          输入时事热点或用户痛点，AI帮你构思产品发明并存入数据库
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="例如：远程办公颈椎疼、宠物独自在家焦虑、夏天户外防晒..."
            style={{
              flex: 1, padding: "13px 18px", borderRadius: "14px", fontSize: "14px",
              background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--text-primary)", fontFamily: "inherit",
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !topic.trim()}
            style={{
              padding: "13px 24px", borderRadius: "14px", fontSize: "14px", fontWeight: 700,
              background: loading ? "rgba(0,255,136,0.1)" : "linear-gradient(135deg, #00ff88, #00cc6a)",
              color: loading ? "#00ff88" : "#0a0e14",
              border: "none", cursor: loading ? "wait" : "pointer",
              opacity: !topic.trim() ? 0.4 : 1,
              whiteSpace: "nowrap", transition: "all 0.3s",
            }}
          >
            {loading ? "🧠 思考中..." : "生成发明 →"}
          </button>
        </div>
      </div>

      {/* Trend pills */}
      {trends.length > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", marginRight: "4px" }}>🔥 热门趋势：</span>
          {trends.map((t, i) => (
            <button
              key={i}
              onClick={() => { setTopic(t.keyword); }}
              style={{
                padding: "6px 14px", borderRadius: "100px", fontSize: "12px",
                background: "rgba(255,215,0,0.06)", border: "1px solid rgba(255,215,0,0.15)",
                color: "#ffd700", cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              title={t.potential}
            >
              {t.keyword}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
