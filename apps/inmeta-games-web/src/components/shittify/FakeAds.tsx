"use client";

import { useEffect, useState } from "react";

export default function FakeAds() {
  const [showPopup, setShowPopup] = useState(false);
  const [moreAds, setMoreAds] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Top banner */}
      <div className="fixed top-0 left-0 right-0 z-[99991] h-16 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 flex items-center justify-center gap-4 animate-pulse">
        <span className="text-white font-bold text-xl">🎯 KLIKK HER FOR GRATIS iPHONE!!!</span>
        <span className="text-yellow-200 font-bold blink">▶▶▶ TILBUD UTLØPER OM 0:03 ◀◀◀</span>
      </div>

      {/* Bottom banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[99991] h-20 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 flex items-center justify-center">
        <span className="text-white font-bold text-lg">💊 LEGER HATER DETTE TRIKSET! KLIKK HER!</span>
        <span className="ml-4 text-yellow-300 text-2xl animate-bounce">👉👉👉</span>
      </div>

      {/* Sidebar ad */}
      <div className="fixed right-0 top-1/4 z-[99992] w-48 bg-gradient-to-b from-pink-400 to-red-600 text-white p-4 rounded-l-lg shadow-2xl">
        <p className="font-bold text-center text-sm">💕 HOT SINGLES</p>
        <p className="text-center text-xs">i ditt område!</p>
        <p className="text-center text-4xl my-2">👩‍🦰</p>
        <p className="text-center text-[10px]">3.7 km unna</p>
        <button className="w-full bg-yellow-400 text-black font-bold py-1 rounded mt-2 text-xs">
          MØTES NÅ
        </button>
      </div>

      {/* Millionth visitor popup */}
      {showPopup && (
        <div className="fixed inset-0 z-[99997] bg-black/70 flex items-center justify-center">
          <div className="bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 p-8 rounded-xl text-center max-w-md border-4 border-yellow-500 shadow-2xl relative">
            <button
              onClick={() => {
                // Clicking X opens more ads
                setMoreAds((m) => m + 1);
                if (moreAds > 2) setShowPopup(false);
              }}
              className="absolute top-1 right-1 text-[8px] text-gray-600"
              style={{ width: 8, height: 8, lineHeight: "8px" }}
            >
              ×
            </button>
            <h3 className="text-3xl font-bold text-white mb-2">🎊 GRATULERER!!! 🎊</h3>
            <p className="text-xl font-bold text-white">Du er vår 1.000.000. besøkende!</p>
            <p className="text-white mt-2">Klikk her for å hente din GRATIS Tesla Model S!</p>
            <button
              onClick={() => setMoreAds((m) => m + 1)}
              className="mt-4 bg-green-500 text-white px-8 py-3 rounded-lg text-xl font-bold animate-pulse"
            >
              HENT PREMIE 🏆
            </button>
            {moreAds > 0 && (
              <div className="mt-4 bg-white/20 p-3 rounded">
                <p className="text-sm text-white font-bold">
                  ⚠️ {moreAds} EKSTRA PREMIE{moreAds > 1 ? "R" : ""} OPPDAGET!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
