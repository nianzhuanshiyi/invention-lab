"use client";

export default function ScoreRing({
  score,
  size = 64,
}: {
  score: number;
  size?: number;
}) {
  const radius = (size / 2) - 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 85 ? "#00ff88" : score >= 70 ? "#ffd700" : "#ff6b6b";
  const center = size / 2;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={center} cy={center} r={radius}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4"
      />
      <circle
        cx={center} cy={center} r={radius}
        fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text
        x={center} y={center + 5}
        textAnchor="middle" fill={color}
        fontSize={size * 0.24} fontWeight="800"
        style={{ transform: `rotate(90deg)`, transformOrigin: `${center}px ${center}px` }}
      >
        {score}
      </text>
    </svg>
  );
}
