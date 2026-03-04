"use client";

import { useEffect, useState } from "react";

const EMOJIS = ["💩", "🔥", "✨", "🤡", "💀", "👻", "🎪"];

interface TrailPoint {
  x: number;
  y: number;
  id: number;
  emoji: string;
}

export default function CursorTrail() {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCounter((c) => c + 1);
      setTrail((prev) => {
        const newPoint: TrailPoint = {
          x: e.clientX,
          y: e.clientY,
          id: Date.now() + Math.random(),
          emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        };
        return [...prev.slice(-19), newPoint];
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[99990] pointer-events-none">
      {trail.map((point, i) => (
        <span
          key={point.id}
          className="absolute text-2xl transition-opacity duration-300"
          style={{
            left: point.x - 12,
            top: point.y - 12,
            opacity: (i + 1) / trail.length,
            transform: `scale(${0.5 + (i / trail.length) * 0.5}) rotate(${i * 15}deg)`,
          }}
        >
          {point.emoji}
        </span>
      ))}
    </div>
  );
}
