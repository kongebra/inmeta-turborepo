"use client";

import { useMemo } from "react";

const EMOJIS = ["💩", "🔥", "🤡", "💀", "👻", "🎪", "🐛", "👽"];

export default function SnowEffect() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        left: Math.random() * 100,
        duration: 4 + Math.random() * 8,
        delay: Math.random() * 10,
        size: 16 + Math.random() * 20,
      })),
    []
  );

  return (
    <div className="fixed inset-0 z-[99989] pointer-events-none overflow-hidden">
      {flakes.map((f) => (
        <span
          key={f.id}
          className="absolute animate-fall"
          style={{
            left: `${f.left}%`,
            top: "-5%",
            fontSize: f.size,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            animationIterationCount: "infinite",
          }}
        >
          {f.emoji}
        </span>
      ))}
    </div>
  );
}
