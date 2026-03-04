"use client";

export default function MarqueeText() {
  return (
    <div className="fixed top-16 left-0 right-0 z-[99991] bg-yellow-400 border-y-4 border-red-600 overflow-hidden">
      <div
        className="py-2 font-bold text-red-600 text-xl whitespace-nowrap"
        style={{
          animation: "marquee-scroll 15s linear infinite",
        }}
      >
        {"🎪 VELKOMMEN TIL DEN BESTE NETTSIDEN I VERDEN!!! 🎪 DU VIL IKKE TRO HVA SOM SKJER VIDERE!!! 🎪 SENSASJONELT!!! 🎪 KLIKK OVERALT FOR PREMIER!!! 🎪 DENNE NETTSIDEN ER 100% SIKKER OG LOVLIG!!! 🎪"}
      </div>
      <style jsx>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
