import Heading from "@/components/heading";
import Link from "next/link";
import React from "react";

export default function NotFoundPage() {
  return (
    <main>
      <div className="max-w-screen-sm mx-auto p-8 min-h-screen bg-black/5 dark:bg-white/5 text-center">
        <Heading className="mb-8">Kunne ikke finne siden!</Heading>

        <Link href="/">Gå til forsiden</Link>
      </div>
    </main>
  );
}
