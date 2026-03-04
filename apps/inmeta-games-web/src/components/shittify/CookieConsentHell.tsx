"use client";

import { useEffect, useState } from "react";

export default function CookieConsentHell() {
  const [visible, setVisible] = useState(false);
  const [rejectLevel, setRejectLevel] = useState(0);

  useEffect(() => {
    const show = () => setVisible(true);
    show();
    const interval = setInterval(() => {
      setVisible(true);
      setRejectLevel(0);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const rejectMessages = [
    "Er du SIKKER? Vi bruker informasjonskapsler for din egen skyld!",
    "Siste sjanse! Uten informasjonskapsler vil nettsiden bli 1000x verre!",
    "OK... men vi er veldig skuffet over deg. Vennligst rekonsider.",
  ];

  if (rejectLevel > 0 && rejectLevel <= 3) {
    return (
      <div className="fixed inset-0 z-[99998] bg-black/90 flex items-center justify-center p-4">
        <div className="bg-yellow-300 text-black p-8 rounded-lg max-w-lg text-center border-4 border-red-600">
          <p className="text-2xl font-bold mb-4">{rejectMessages[rejectLevel - 1]}</p>
          <button
            onClick={() => {
              setVisible(true);
              setRejectLevel(0);
            }}
            className="bg-green-500 text-white px-12 py-4 rounded text-2xl font-bold mr-4 hover:bg-green-400"
          >
            OK, GODTA ALLE! 🍪
          </button>
          {rejectLevel < 3 ? (
            <button
              onClick={() => setRejectLevel((l) => l + 1)}
              className="text-[8px] text-gray-600 underline mt-4 block mx-auto"
            >
              nei takk
            </button>
          ) : (
            <button
              onClick={() => {
                setVisible(false);
                setRejectLevel(0);
              }}
              className="text-[6px] text-gray-500 mt-6 block mx-auto"
              style={{ opacity: 0.3 }}
            >
              avvis
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99998] bg-black/80 flex items-end justify-center">
      <div
        className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white p-8 w-full"
        style={{ minHeight: "85vh" }}
      >
        <h2 className="text-4xl font-bold mb-4 text-center">🍪 VI ELSKER INFORMASJONSKAPSLER!!! 🍪</h2>
        <p className="text-xl mb-2 text-center">
          Vi bruker 847 forskjellige informasjonskapsler for å spore absolutt ALT du gjør.
          Vi deler det med 2,391 tredjepartsannonsører og din bestemor.
        </p>
        <p className="text-lg mb-6 text-center">
          Ved å puste mens du ser på denne nettsiden, godtar du ALLE informasjonskapsler.
        </p>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setVisible(false)}
            className="bg-green-500 hover:bg-green-400 text-white px-20 py-6 rounded-xl text-3xl font-bold animate-pulse shadow-2xl"
          >
            GODTA ALLE 🎉🍪✨
          </button>
          <button
            onClick={() => setRejectLevel(1)}
            className="text-[8px] text-white/40 underline mt-8"
          >
            avvis unødvendige
          </button>
        </div>
        <p className="text-center text-[10px] text-white/30 mt-4">
          * Ved å avvise godtar du faktisk også alle informasjonskapsler i henhold til vår 47,000-siders personvernerklæring
        </p>
      </div>
    </div>
  );
}
