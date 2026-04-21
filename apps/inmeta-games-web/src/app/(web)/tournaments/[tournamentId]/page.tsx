import { NidarosSection, Skilt } from "@/components/nidaros";
import { fetchTournamentDetails } from "@/lib/sanity/queries";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TournamentGamesList from "./_components/TournamentGamesList";
import TournamentPointSystemCard from "./_components/TournamentPointSystemCard";
import TournamentScoreboardTable from "./_components/TournamentScoreboardTable";

type Params = { tournamentId: string };
type Props = { params: Params };

export async function generateMetadata({ params: { tournamentId } }: Props): Promise<Metadata> {
  const tournament = await fetchTournamentDetails(tournamentId);
  if (!tournament) return {};
  return {
    title: `${tournament.name} — Trønder Leikan`,
    description: `Standings og spill for ${tournament.name}`,
  };
}

export default async function TournamentPage({ params: { tournamentId } }: Props) {
  const tournament = await fetchTournamentDetails(tournamentId);
  if (!tournament) return notFound();

  const doneCount = tournament.games.filter((g) => g.isDone).length;
  const allDone = doneCount === tournament.games.length && tournament.games.length > 0;
  const hasAny = doneCount > 0;

  const statusLabel = allDone ? "Ferdig" : hasAny ? "● Aktiv" : "Planlagt";
  const statusVariant = allDone ? "muted" : hasAny ? "skog" : "dark";

  return (
    <main>
      <div className="container py-8">
        <div className="font-mono text-[10px] text-n-ink-dim uppercase tracking-[0.12em] mb-4">
          <Link href="/" className="hover:text-n-ink transition-colors">
            ← Alle turneringer
          </Link>
        </div>

        <div className="flex flex-wrap items-baseline gap-3 mb-2">
          <h1 className="font-display text-4xl lg:text-5xl leading-none text-n-ink">
            {tournament.name}
          </h1>
          <Skilt variant={statusVariant as "rust" | "skog" | "messing" | "muted" | "dark"}>
            {statusLabel}
          </Skilt>
        </div>

        <p className="font-serif italic text-n-ink-dim text-lg mt-2 mb-8 max-w-xl">
          {doneCount} spill gjennomført
          {tournament.games.length - doneCount > 0
            ? ` · ${tournament.games.length - doneCount} igjen`
            : ""}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
          {/* LEFT — games timeline */}
          <div>
            <NidarosSection title="Spill i kronologi">
              <TournamentGamesList tournament={tournament} />
            </NidarosSection>
          </div>

          {/* RIGHT — standings + collapsed point rules */}
          <div>
            <NidarosSection title="Standings" aside="Etter poeng">
              <TournamentScoreboardTable tournament={tournament} />
            </NidarosSection>

            <NidarosSection title="Poengeregler">
              <TournamentPointSystemCard tournament={tournament} />
            </NidarosSection>
          </div>
        </div>
      </div>
    </main>
  );
}
