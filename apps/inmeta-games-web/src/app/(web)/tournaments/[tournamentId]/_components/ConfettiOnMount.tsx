"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiOnMount() {
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.3 },
    });
  }, []);

  return null;
}
