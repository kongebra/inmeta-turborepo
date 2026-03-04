"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
};

export default function AnimatedScore({ value }: Props) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const duration = 800;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  return <>{display}</>;
}
