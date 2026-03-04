"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function FakeLoadingBar() {
  const [width, setWidth] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setWidth(0);
    const interval = setInterval(() => {
      setWidth((prev) => {
        // Occasional backward glitch
        if (Math.random() < 0.1) return Math.max(0, prev - Math.random() * 15);
        // Slow down as it approaches 92%
        const remaining = 92 - prev;
        if (remaining <= 0) return 92;
        return prev + remaining * 0.05 + Math.random() * 2;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [pathname]);

  return (
    <div
      className="fixed top-0 left-0 z-[99999] h-[3px]"
      style={{
        width: `${width}%`,
        background: "linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #9400d3)",
        transition: "width 0.2s ease-out",
        boxShadow: "0 0 10px #ff0000, 0 0 20px #ff7f00",
      }}
    />
  );
}
