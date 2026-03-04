"use client";

import { useEffect } from "react";

export default function VisualChaos() {
  useEffect(() => {
    const wobble = setInterval(() => {
      const angle = (Math.random() - 0.5) * 4;
      document.body.style.transition = "transform 0.5s ease-in-out";
      document.body.style.transform = `rotate(${angle}deg)`;
    }, 5000);

    const flash = setInterval(() => {
      if (Math.random() < 0.3) {
        document.body.style.filter = "invert(1)";
        setTimeout(() => {
          document.body.style.filter = "";
        }, 200);
      }
    }, 8000);

    return () => {
      clearInterval(wobble);
      clearInterval(flash);
      document.body.style.transform = "";
      document.body.style.filter = "";
    };
  }, []);

  return null;
}
