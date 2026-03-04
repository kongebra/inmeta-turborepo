"use client";

import { useState, useRef } from "react";

const RANDOM_CHARS = "æøåÆØÅ!?#¤%&/()=🤡💩🔥";

export default function BadInputs() {
  const [value, setValue] = useState("Søk her...");
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setValue("");
    setShowResults(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue((prev) => {
      // Insert random char instead of typed char
      const randomChar = RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
      const newVal = prev + randomChar;
      // 20% chance to reverse
      if (Math.random() < 0.2) return newVal.split("").reverse().join("");
      return newVal;
    });
  };

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[99992] w-96" data-shittify>
      <input
        ref={inputRef}
        value={value}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onChange={() => {}}
        className="w-full px-4 py-2 rounded-lg border-2 border-yellow-500 bg-white text-black text-center font-bold shadow-lg"
        placeholder="Søk her..."
      />
      {showResults && (
        <div className="bg-white border-2 border-red-500 rounded-b-lg p-3 text-center text-red-600 font-bold shadow-lg">
          0 resultater funnet 😢
        </div>
      )}
    </div>
  );
}
