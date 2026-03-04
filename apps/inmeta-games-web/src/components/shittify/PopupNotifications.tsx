"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "🔥 Hot singles i ditt område!",
  "⬇️ Laster ned RAM... 47%",
  "👀 Din sjef ser på skjermen din!",
  "🎉 Du har vunnet en gratis iPhone 47!",
  "⚠️ ADVARSEL: 847 virus funnet på din PC!",
  "💰 Tjen 100.000 kr hjemmefra med dette RARE trikset!",
  "🤖 Vi har oppdaget at du er en robot. Bevis at du er menneske!",
  "📧 Du har 1,847 uleste e-poster!",
  "🔔 Noen du ikke kjenner vil chatte med deg!",
  "💾 Datamaskinen din er FULL. Slett System32 for å frigjøre plass!",
];

interface Toast {
  id: number;
  message: string;
  x: number;
  y: number;
}

export default function PopupNotifications() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = () => {
    const toast: Toast = {
      id: Date.now() + Math.random(),
      message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
      x: Math.random() * (window.innerWidth - 300),
      y: Math.random() * (window.innerHeight - 100),
    };
    setToasts((prev) => [...prev, toast]);
  };

  const dismissToast = (id: number) => {
    // 50% chance to spawn 2 more
    if (Math.random() < 0.5) {
      addToast();
      addToast();
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const spawn = () => {
      addToast();
      const nextDelay = 4000 + Math.random() * 4000;
      timeout = setTimeout(spawn, nextDelay);
    };
    let timeout = setTimeout(spawn, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed inset-0 z-[99993] pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="absolute bg-gradient-to-r from-red-600 to-orange-500 text-white p-4 rounded-lg shadow-2xl pointer-events-auto border-2 border-yellow-400 max-w-[300px]"
          style={{ left: toast.x, top: toast.y }}
        >
          <p className="font-bold text-sm">{toast.message}</p>
          <button
            onClick={() => dismissToast(toast.id)}
            className="mt-2 bg-yellow-400 text-black px-3 py-1 rounded text-xs font-bold hover:bg-yellow-300"
          >
            LUKK (kanskje)
          </button>
        </div>
      ))}
    </div>
  );
}
