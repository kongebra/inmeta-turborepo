import React from "react";

export default function Loading() {
  return (
    <main>
      <div className="container py-8 space-y-4">
        <div className="h-3 w-32 bg-n-bg3 animate-pulse" />
        <div className="h-12 w-96 bg-n-bg2 animate-pulse" />
        <div className="h-4 w-64 bg-n-bg3 animate-pulse mt-2" />
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 mt-8">
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-n-bg2 border border-n-line animate-pulse" />
            ))}
          </div>
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 bg-n-bg2 border border-n-line animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
