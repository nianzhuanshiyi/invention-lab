"use client";

import { useState, useEffect } from "react";
import { Invention } from "@/lib/types";
import ScoreRing from "./ScoreRing";

export default function DetailModal({
  invention,
  onClose,
  onUpdate,
}: {
  invention: Invention | null;
  onClose: () => void;
  onUpdate?: (inv: Invention) => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");

  useEffect(() => {
    setImageUrl(null);
    setGenerating(false);
    setCustomPrompt("");
  }, [invention?.id]);

  if (!invention) return null;

  const displayImage = imageUrl || invention.imageUrl;

  const handleGenerateImage = async (extraPrompt?: string) => {
    if (!invention.imagePrompt || generating) return;
    setGenerating(true);
    try {
      const prompt = invention.imagePrompt + (extraPrompt ? ". Additional requirements: " + extraPrompt : "");
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inventionId: invention.id, prompt }),
      });
      if (res.ok) {
        const data = await res.json();
        setImageUrl(data.imageUrl);
        if (onUpdate) onUpdate({ ...invention, imageUrl: data.imageUrl });
      }
    } catch (err) {
      console.error("Image gen failed:", err);
    }
    setGenerating(false);
  };

  const infoRows = [
    { icon: "📈", label: "趋势来源", value: `${invention.trendSource} — "${invention.trend}"`, color: "#ffd700" },
    { icon: "😤", label: "用户痛点", value: invention.painPoint, color: "#ff6b6b" },
    { icon: "💡", label: "解决方案", value: invention.solution, color: "#00ff88" },
    { icon: "🎯", label: "目标市场", value: invention.marketSize || "待评估", color: "#6bb3ff" },
  ];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: "linear-gradient(160deg, #1a1f2e 0%, #0d1017 100%)", border: "1px solid rgba(0,255,136,0.12)", borderRadius: "24px", maxWidth: "660px", width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <span style={{ padding: "5px 14px", borderRadius: "100px", fontSize: "12px", background: "rgba(0,255,136,0.15)", color: "#00ff88", fontWeight: "600" }}>{invention.category}</span>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", width: "34px", height: "34px", borderRadius: "50%", cursor: "pointer", fontSize: "16px" }}>✕</button>
        </div>
        <h2 style={{ fontSize: "26px", fontWeight: "800", margin: "0 0 6px 0" }}>{invention.title}</h2>
        <p style={{ fontSize: "15px", color: "rgba(0,255,136,0.65)", margin: "0 0 24px 0", fontStyle: "italic" }}>{invention.tagline}</p>

        <div onClick={!displayImage && !generating ? () => handleGenerateImage() : undefined} style={{ background: displayImage ? "transparent" : "linear-gradient(135deg, rgba(0,255,136,0.04), rgba(0,100,255,0.04))", border: displayImage ? "none" : "1px dashed rgba(0,255,136,0.15)", borderRadius: "16px", minHeight: "200px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: displayImage ? "12px" : "24px", cursor: displayImage ? "default" : "pointer", overflow: "hidden" }}>
          {displayImage ? (
            <img src={displayImage} alt={invention.title} style={{ width: "100%", borderRadius: "16px", objectFit: "cover" }} />
          ) : generating ? (
            <>
              <div style={{ width: "32px", height: "32px", border: "3px solid rgba(0,255,136,0.2)", borderTopColor: "#00ff88", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "12px" }}>AI概念图生成中...</span>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </>
          ) : (
            <>
              <span style={{ fontSize: "36px", marginBottom: "10px" }}>🎨</span>
              <span style={{ fontSize: "14px", color: "#00ff88", fontWeight: "600" }}>点击生成 AI 概念图</span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "6px" }}>Powered by DALL·E 3</span>
            </>
          )}
        </div>

        {displayImage && !generating && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", alignItems: "center" }}>
            <input
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="补充要求，如：白色背景、去掉灯光效果..."
              style={{ flex: 1, padding: "8px 12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: "12px", outline: "none", fontFamily: "inherit" }}
            />
            <button onClick={() => handleGenerateImage()} style={{ padding: "8px 14px", borderRadius: "10px", border: "1px solid rgba(0,255,136,0.2)", background: "rgba(0,255,136,0.08)", color: "#00ff88", fontSize: "12px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>🔄 重新生成</button>
            {customPrompt.trim() && (
              <button onClick={() => handleGenerateImage(customPrompt)} style={{ padding: "8px 14px", borderRadius: "10px", border: "1px solid rgba(100,180,255,0.2)", background: "rgba(100,180,255,0.08)", color: "#6bb3ff", fontSize: "12px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>按要求重新生成</button>
            )}
          </div>
        )}

        {generating && displayImage && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", justifyContent: "center" }}>
            <div style={{ width: "16px", height: "16px", border: "2px solid rgba(0,255,136,0.2)", borderTopColor: "#00ff88", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>重新生成中...</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {infoRows.map((row, i) => (
          <div key={i} style={{ padding: "14px 18px", borderRadius: "14px", marginBottom: "10px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "6px" }}>
              <span style={{ fontSize: "14px" }}>{row.icon}</span>
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.8px" }}>{row.label}</span>
            </div>
            <p style={{ fontSize: "13.5px", color: row.color, margin: 0, lineHeight: 1.65, fontWeight: "500" }}>{row.value}</p>
          </div>
        ))}

        {invention.highlights && invention.highlights.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "18px" }}>
            {invention.highlights.map((h, i) => (
              <span key={i} style={{ padding: "5px 13px", borderRadius: "100px", fontSize: "11.5px", background: "rgba(0,255,136,0.15)", color: "#00ff88", border: "1px solid rgba(0,255,136,0.1)" }}>{h}</span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", padding: "18px", borderRadius: "14px", background: "rgba(0,255,136,0.03)", border: "1px solid rgba(0,255,136,0.08)" }}>
          <div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginBottom: "3px" }}>建议售价</div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#00ff88" }}>{invention.targetPrice || "待定"}</div>
          </div>
          <ScoreRing score={invention.score} size={68} />
        </div>
      </div>
    </div>
  );
}
