"use client";

import { useEffect } from "react";

export default function DodgyElements() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        (target.tagName === "BUTTON" || target.tagName === "A") &&
        !target.closest("[data-shittify]") &&
        Math.random() < 0.4
      ) {
        const dx = (Math.random() - 0.5) * 400;
        const dy = (Math.random() - 0.5) * 400;
        target.style.transition = "transform 0.2s ease-out";
        target.style.transform = `translate(${dx}px, ${dy}px)`;
        setTimeout(() => {
          target.style.transform = "";
        }, 2000);
      }
    };
    document.addEventListener("mouseover", handler);
    return () => document.removeEventListener("mouseover", handler);
  }, []);

  return null;
}
