"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
};

export default function ScoreboardReveal({ children }: Props) {
  const [state, setState] = useState<"prompt" | "drumroll" | "revealed">(
    "prompt"
  );

  if (state === "prompt") {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-xl font-semibold">Klar for resultatene?</p>
        <Button
          size="lg"
          onClick={() => {
            setState("drumroll");
            setTimeout(() => setState("revealed"), 2500);
          }}
        >
          Vis resultater
        </Button>
      </div>
    );
  }

  if (state === "drumroll") {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <span className="text-6xl animate-bounce">🥁</span>
        <p className="text-lg font-semibold animate-pulse">Trommevirvel...</p>
      </div>
    );
  }

  return <div className="animate-in fade-in duration-700">{children}</div>;
}
