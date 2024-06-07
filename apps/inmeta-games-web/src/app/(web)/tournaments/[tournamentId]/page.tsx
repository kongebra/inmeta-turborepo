import Heading from "@/components/heading";
import { fetchTournamentDetails } from "@/lib/sanity/queries";
import { unstable_noStore } from "next/cache";
import { notFound } from "next/navigation";
import TournamentGamesList from "./_components/TournamentGamesList";
import TournamentPointSystemCard from "./_components/TournamentPointSystemCard";
import TournamentScoreboardTable from "./_components/TournamentScoreboardTable";
import { Metadata } from "next";

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

  const gameNames = tournament.games.map((game) => game.name);

  return {
    title: `${tournament.name} - Inmeta Games`,
    description: `Resultater for ${tournament.name}`,
    keywords: [tournament.name, ...gameNames, "inmeta"],
    openGraph: {
      // TODO: add scoreboard or something for this
      title: `${tournament.name} - Inmeta Games`,
      description: `Resultater for ${tournament.name}`,
      url: `https://inmeta-games.vercel.app/tournaments/${tournamentId}`,
      type: "website",
    },
  } satisfies Metadata;
}

export default async function TournamentPage({
  params: { tournamentId },
}: Props) {
  unstable_noStore();
  const tournament = await fetchTournamentDetails(tournamentId);

  if (!tournament) {
    return notFound();
  }

  return (
    <main className="">
      <div className="container py-8">
        <Heading className="mb-8">{tournament.name}</Heading>

        <Heading className="mb-8" size="h2">
          Poengsystem
        </Heading>

        <TournamentPointSystemCard tournament={tournament} />

        <Heading className="mb-8" size="h2">
          Games
        </Heading>

        <TournamentGamesList tournament={tournament} />

        <Heading className="mb-8" size="h2">
          Scoreboard
        </Heading>

        <TournamentScoreboardTable tournament={tournament} />
      </div>
    </main>
  );
}
