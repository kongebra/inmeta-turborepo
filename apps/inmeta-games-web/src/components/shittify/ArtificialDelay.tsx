"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const MESSAGES = [
  "Optimaliserer din opplevelse...",
  "Laster inn unødvendige ressurser...",
  "Samler dine personlige data...",
  "Kryptominerer litt...",
  "Installerer verktøylinjer...",
  "Oppdaterer Flash Player...",
];

export default function ArtificialDelay() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(MESSAGES[0]);
  const pathname = usePathname();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    setLoading(true);
    setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
    const delay = 2000 + Math.random() * 3000;
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[99996] bg-black/80 flex flex-col items-center justify-center">
      <div className="text-6xl mb-6 animate-spin">⏳</div>
      <p className="text-white text-2xl font-bold mb-4">{message}</p>
      <div className="w-64 h-4 bg-gray-700 rounded overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-yellow-500 animate-pulse"
          style={{ width: "67%" }}
        />
      </div>
      <p className="text-gray-400 text-sm mt-4">Vennligst ikke lukk nettleseren...</p>
    </div>
  );
}
