import Heading from "@/components/heading";
import { fetchTournamentDetails } from "@/lib/sanity/queries";
import { calculateScoreboard } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import PodiumStage from "./_components/PodiumStage";

type Params = {
  tournamentId: string;
};

type Props = {
  params: Params;
};

export async function generateMetadata({ params: { tournamentId } }: Props) {
  const tournament = await fetchTournamentDetails(tournamentId);
  if (!tournament) {
    return notFound();
  }

  return {
    title: `Podium - ${tournament.name} - Inmeta Games`,
    description: `Podium for ${tournament.name}`,
  };
}

export default async function PodiumPage({
  params: { tournamentId },
}: Props) {
  const tournament = await fetchTournamentDetails(tournamentId);

  if (!tournament) {
    return notFound();
  }

  const scoreboard = calculateScoreboard(tournament);
  const top3 = scoreboard
    .filter((item) => item.rank <= 3)
    .map((item) => ({
      rank: item.rank,
      player: item.player,
      score: item.score,
    }));

  const uniqueRanks = [...new Set(scoreboard.map((item) => item.rank))];
  const bottomRanks = uniqueRanks.slice(-3).reverse();
  const bottom3 = bottomRanks.flatMap((rank, index) =>
    scoreboard
      .filter((item) => item.rank === rank)
      .map((item) => ({
        rank: index + 1,
        player: item.player,
        score: item.score,
      }))
  );

  return (
    <main>
      <div className="container py-8">
        <div className="mb-8">
          <Link href={`/tournaments/${tournamentId}`}>
            &larr; Gå tilbake til turneringen
          </Link>
        </div>

        <Heading className="mb-8">{tournament.name} - Podium 🏆</Heading>

        <PodiumStage entries={top3} />

        <Heading className="mb-8 mt-16">Biggest Losers 💩</Heading>

        <PodiumStage entries={bottom3} variant="losers" />
      </div>
    </main>
  );
}
