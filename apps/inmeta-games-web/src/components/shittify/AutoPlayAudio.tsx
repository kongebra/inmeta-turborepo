"use client";

import { useEffect, useRef, useState } from "react";

const MELODY = [262, 294, 330, 349, 392, 349, 330, 294, 262, 330, 392, 523];

export default function AutoPlayAudio() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAudio = () => {
    if (playing) return;
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.connect(ctx.destination);
    audioCtxRef.current = ctx;
    gainRef.current = gain;

    let noteIndex = 0;
    const playNote = () => {
      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.value = MELODY[noteIndex % MELODY.length];
      osc.connect(gain);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      noteIndex++;
    };

    playNote();
    intervalRef.current = setInterval(playNote, 400);
    setPlaying(true);
  };

  useEffect(() => {
    const handler = () => {
      startAudio();
      window.removeEventListener("click", handler);
    };
    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
      if (intervalRef.current) clearInterval(intervalRef.current);
      audioCtxRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume;
  }, [volume]);

  if (!playing) return null;

  return (
    <div className="fixed bottom-24 left-4 z-[99994] bg-gradient-to-r from-gray-800 to-gray-900 text-green-400 p-3 rounded-lg border-2 border-green-500 shadow-xl w-64">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold">🎵 MIDI_BANGER.mid</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVolume((v) => Math.min(1, v + 0.2))}
            className="text-red-400 font-bold text-sm bg-gray-700 w-5 h-5 flex items-center justify-center rounded"
            title="Lukk"
          >
            ✕
          </button>
          <button
            onClick={() => {
              if (intervalRef.current) clearInterval(intervalRef.current);
              audioCtxRef.current?.close();
              setPlaying(false);
            }}
            className="text-green-400"
            style={{ width: 2, height: 2, fontSize: 1, opacity: 0.1 }}
            title="."
          >
            .
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-700 rounded overflow-hidden">
          <div className="h-full bg-green-500 animate-pulse" style={{ width: "60%" }} />
        </div>
        <span className="text-[10px]">VOL: {Math.round(volume * 100)}%</span>
      </div>
      <div className="flex justify-center gap-1 mt-2 text-green-400 text-xs">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-2 bg-green-500 animate-pulse"
            style={{
              height: `${8 + Math.random() * 12}px`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
