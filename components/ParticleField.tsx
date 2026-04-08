"use client";

import { useMemo } from "react";

export default function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        size: 2 + Math.random() * 2.5,
        hue: 155 + Math.random() * 40,
        lightness: 50 + Math.random() * 25,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: 0.2 + Math.random() * 0.3,
        duration: 10 + Math.random() * 15,
        delay: -Math.random() * 12,
      })),
    []
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `hsl(${p.hue}, 75%, ${p.lightness}%)`,
            borderRadius: "50%",
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.opacity,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
