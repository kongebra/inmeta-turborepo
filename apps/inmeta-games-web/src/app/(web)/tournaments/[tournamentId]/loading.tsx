import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import TournamentPointSystemCardSkeleton from "./_components/loading/TournamentPointSystemCardSkeleton";
import Heading from "@/components/heading";
import TournamentGamesListSkeleton from "./_components/loading/TournamentGamesListSkeleton";
import TournamentScoreboardTableSkeleton from "./_components/loading/TournamentScoreboardTableSkeleton";

export default function loading() {
  return (
    <main className="">
      <div className="container py-8">
        <Skeleton className="h-10 w-52 mb-8" />

        <TournamentPointSystemCardSkeleton />

        <Heading className="mb-8" size="h2">
          Games
        </Heading>

        <TournamentGamesListSkeleton />

        <Heading className="mb-8" size="h2">
          Scoreboard
        </Heading>

        <TournamentScoreboardTableSkeleton />
      </div>
    </main>
  );
}
