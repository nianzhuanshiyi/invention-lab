"use client";

import { Invention } from "@/lib/types";
import ScoreRing from "./ScoreRing";

export default function InventionCard({
  invention,
  index,
  onClick,
  onVote,
}: {
  invention: Invention;
  index: number;
  onClick: (inv: Invention) => void;
  onVote: (id: string) => void;
}) {
  return (
    <div
      className="invention-card animate-fade-up"
      onClick={() => onClick(invention)}
      style={{
        background: "linear-gradient(135deg, rgba(30,35,45,0.9), rgba(15,18,25,0.95))",
        border: "1px solid var(--border)",
        borderRadius: "20px",
        padding: "26px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        animationDelay: `${index * 0.08}s`,
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,255,136,0.2), transparent)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <span style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 600, background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(0,255,136,0.2)" }}>{invention.category}</span>
        <ScoreRing score={invention.score} size={58} />
      </div>
      <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 6px", lineHeight: 1.3 }}>{invention.title}</h3>
      <p style={{ fontSize: "13px", color: "rgba(0,255,136,0.65)", margin: "0 0 16px", fontStyle: "italic", fontWeight: 500 }}>&ldquo;{invention.tagline}&rdquo;</p>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", padding: "7px 12px", borderRadius: "10px", background: "rgba(255,255,255,0.02)" }}>
        <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>趋势</span>
        <span style={{ fontSize: "12px", color: "var(--warning)", fontWeight: 600 }}>{invention.trendSource}</span>
      </div>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
        <span style={{ color: "var(--danger)", fontWeight: 600 }}>痛点：</span>{invention.painPoint}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{invention.targetPrice}</span>
          <button onClick={(e) => { e.stopPropagation(); onVote(invention.id); }} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 10px", borderRadius: "100px", fontSize: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer" }}>
            ▲ {invention.votes}
          </button>
        </div>
        <span style={{ padding: "4px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 600, background: invention.status === "已验证" ? "rgba(0,255,136,0.12)" : "rgba(255,215,0,0.12)", color: invention.status === "已验证" ? "#00ff88" : "#ffd700" }}>{invention.status}</span>
      </div>
    </div>
  );
}
