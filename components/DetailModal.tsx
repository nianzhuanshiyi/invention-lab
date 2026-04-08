"use client";
import { Invention } from "@/lib/types";
import ScoreRing from "./ScoreRing";

export default function DetailModal({ invention, onClose }: { invention: Invention | null; onClose: () => void }) {
  if (!invention) return null;
  const sections = [
    { icon: "📈", label: "趋势来源", value: `${invention.trendSource} — "${invention.trend}"`, color: "#ffd700" },
    { icon: "😤", label: "用户痛点", value: invention.painPoint, color: "#ff6b6b" },
    { icon: "💡", label: "解决方案", value: invention.solution, color: "#00ff88" },
    { icon: "🎯", label: "目标市场", value: invention.marketSize || "待评估", color: "#6bb3ff" },
  ];
  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: "linear-gradient(160deg, #1a1f2e, #0d1017)", border: "1px solid rgba(0,255,136,0.15)", borderRadius: "24px", maxWidth: "700px", width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <span style={{ padding: "5px 14px", borderRadius: "100px", fontSize: "12px", background: "var(--accent-dim)", color: "var(--accent)", fontWeight: 600 }}>{invention.category}</span>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", width: "34px", height: "34px", borderRadius: "50%", cursor: "pointer", fontSize: "16px" }}>✕</button>
        </div>
        <h2 style={{ fontSize: "26px", fontWeight: 800, margin: "0 0 6px", lineHeight: 1.3 }}>{invention.title}</h2>
        <p style={{ fontSize: "15px", color: "rgba(0,255,136,0.7)", margin: "0 0 24px", fontStyle: "italic" }}>{invention.tagline}</p>
        <div style={{ background: "linear-gradient(135deg, rgba(0,255,136,0.04), rgba(0,100,255,0.04))", border: "1px dashed rgba(0,255,136,0.2)", borderRadius: "16px", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: "24px", minHeight: "200px" }}>
          {invention.imageUrl ? (
            <img src={invention.imageUrl} alt={invention.title} style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "12px" }} />
          ) : (
            <>
              <span style={{ fontSize: "36px", marginBottom: "10px" }}>🎨</span>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>AI概念图生成区 (Google Nano / Gemini)</span>
              {invention.imagePrompt && <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "10px", maxWidth: "440px", textAlign: "center", lineHeight: 1.5 }}>Prompt: {invention.imagePrompt}</span>}
            </>
          )}
        </div>
        {sections.map((s, i) => (
          <div key={i} style={{ padding: "14px 18px", borderRadius: "14px", marginBottom: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span>{s.icon}</span>
              <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</span>
            </div>
            <p style={{ fontSize: "14px", color: s.color, margin: 0, lineHeight: 1.6, fontWeight: 500 }}>{s.value}</p>
          </div>
        ))}
        {invention.highlights.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "18px" }}>
            {invention.highlights.map((h, i) => (
              <span key={i} style={{ padding: "5px 13px", borderRadius: "100px", fontSize: "12px", background: "rgba(0,255,136,0.07)", color: "#00ff88", border: "1px solid rgba(0,255,136,0.12)" }}>{h}</span>
            ))}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", padding: "18px", borderRadius: "14px", background: "rgba(0,255,136,0.03)", border: "1px solid rgba(0,255,136,0.08)" }}>
          <div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "4px" }}>建议售价</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#00ff88" }}>{invention.targetPrice || "待定"}</div>
          </div>
          <div style={{ textAlign: "center" }}><ScoreRing score={invention.score} size={68} /><div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>可行性</div></div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "4px" }}>投票数</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)" }}>{invention.votes}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
