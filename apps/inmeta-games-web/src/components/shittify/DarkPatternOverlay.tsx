"use client";

import { useEffect, useState } from "react";

export default function DarkPatternOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (Math.random() < 0.05 && !visible) {
        e.preventDefault();
        e.stopPropagation();
        setVisible(true);
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center" data-shittify>
      <div className="bg-white rounded-xl p-8 max-w-sm text-center shadow-2xl border-4 border-purple-500">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">📧 Abonner på vårt nyhetsbrev?</h3>
        <p className="text-gray-600 mb-6">
          Få 847 e-poster om dagen med innhold du ABSOLUTT ikke trenger!
        </p>
        <button
          onClick={() => setVisible(false)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-bold text-lg mb-3 w-full"
        >
          JA, SPAM MEG! 🎉
        </button>
        <button
          onClick={() => setVisible(false)}
          className="text-[9px] text-gray-400 underline"
        >
          Nei, jeg hater gode tilbud og lykke generelt
        </button>
      </div>
    </div>
  );
}
