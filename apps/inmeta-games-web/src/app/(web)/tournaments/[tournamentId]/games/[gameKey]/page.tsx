import { Medal, NidarosSection, PlayerAvatar, Skilt } from "@/components/nidaros";
import { urlForImage } from "@/lib/sanity";
import { fetchTournamentDetails } from "@/lib/sanity/queries";
import { Person } from "@/lib/sanity/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { tournamentId: string; gameKey: string };
type Props = { params: Params };

export async function generateMetadata({ params: { tournamentId, gameKey } }: Props) {
  const tournament = await fetchTournamentDetails(tournamentId);
  const game = tournament?.games.find((g) => g._key === gameKey);
  if (!tournament || !game) return {};
  return {
    title: `${game.name} — ${tournament.name} — Trønder Leikan`,
    description: `Resultat for ${game.name} i ${tournament.name}`,
  };
}

const placementMeta = [
  { key: "firstPlace" as const, rank: 1, label: "1. plass", color: "border-n-messing" },
  { key: "secondPlace" as const, rank: 2, label: "2. plass", color: "border-n-solv" },
  { key: "thirdPlace" as const, rank: 3, label: "3. plass", color: "border-n-bronze" },
];

export default async function TournamentGamesPage({ params: { tournamentId, gameKey } }: Props) {
  const tournament = await fetchTournamentDetails(tournamentId);
  const game = tournament?.games.find((g) => g._key === gameKey);
  if (!tournament || !game) return notFound();

  const heroImage = game.image ? urlForImage(game.image) : null;

  return (
    <main>
      <div className="container py-8">
        <div className="font-mono text-[10px] text-n-ink-dim uppercase tracking-[0.12em] mb-4">
          <Link
            href={`/tournaments/${tournamentId}`}
            className="hover:text-n-ink transition-colors"
          >
            ← Tilbake til {tournament.name}
          </Link>
        </div>

        {/* Header */}
        <div className="mb-2">
          <Skilt variant={game.isDone ? "dark" : "rust"}>
            {game.isDone ? "Ferdig" : "Ikke spilt ennå"}
          </Skilt>
          <h1 className="font-display text-4xl lg:text-5xl leading-none mt-3 text-n-ink">
            {game.name}
          </h1>
          {game.organiziers && game.organiziers.length > 0 && (
            <div className="font-mono text-[10px] text-n-ink-dim uppercase tracking-[0.12em] mt-2">
              Arrangert av{" "}
              {game.organiziers.map((o) => `${o.firstName} ${o.lastName}`).join(", ")}
            </div>
          )}
        </div>

        {/* Hero image */}
        {heroImage && (
          <div className="relative w-full aspect-[16/6] mt-6 border border-n-line overflow-hidden">
            <Image
              src={heroImage}
              alt={game.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-n-bg/60 to-transparent" />
          </div>
        )}

        {/* Description */}
        {game.description && (
          <div className="mt-6 p-4 bg-n-bg2 border border-n-line border-l-4 border-l-n-rust">
            <div className="font-mono text-[8px] text-n-rust uppercase tracking-[0.12em] mb-2">
              Slik gikk det
            </div>
            <p className="font-serif italic text-n-ink text-[15px] leading-relaxed">
              &laquo;{game.description}&raquo;
            </p>
          </div>
        )}

        {/* Placements */}
        {game.isDone && (
          <NidarosSection title="Plassering" className="mt-6">
            <div className="space-y-2">
              {placementMeta.map(({ key, rank, label, color }) => {
                const players = game[key];
                if (!players || players.length === 0) return null;
                return (
                  <div
                    key={key}
                    className={`bg-n-bg2 border-2 ${color} p-4 flex items-center gap-4`}
                  >
                    <Medal rank={rank} size="lg" />
                    <div className="flex flex-wrap gap-3 flex-1">
                      {players.map((p: Person, i: number) => {
                        const img = p.image ? urlForImage(p.image) : null;
                        return (
                          <Link
                            key={p._id}
                            href={`/players/${p._id}`}
                            className="flex items-center gap-2.5 group"
                          >
                            <PlayerAvatar
                              firstName={p.firstName}
                              lastName={p.lastName}
                              imageSrc={img}
                              size="md"
                              tone={i}
                            />
                            <span className="font-display text-[14px] text-n-ink group-hover:text-n-rust transition-colors">
                              {p.firstName} {p.lastName}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="font-mono text-[10px] text-n-rust uppercase tracking-[0.12em] shrink-0">
                      +{tournament.pointRules[
                        key === "firstPlace"
                          ? "firstPlace"
                          : key === "secondPlace"
                          ? "secondPlace"
                          : "thirdPlace"
                      ]}{" "}
                      p
                    </div>
                  </div>
                );
              })}
            </div>
          </NidarosSection>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
          {/* Participants */}
          {game.participants && game.participants.length > 0 && (
            <NidarosSection title="Deltakere" aside={`${game.participants.length} stk`}>
              <div className="flex flex-wrap gap-2">
                {game.participants.map((p: Person, i: number) => {
                  const img = p.image ? urlForImage(p.image) : null;
                  return (
                    <Link
                      key={p._id}
                      href={`/players/${p._id}`}
                      className="flex items-center gap-2 bg-n-bg2 border border-n-line px-2.5 py-1.5 hover:border-n-rust transition-colors group"
                    >
                      <PlayerAvatar
                        firstName={p.firstName}
                        lastName={p.lastName}
                        imageSrc={img}
                        size="sm"
                        tone={i}
                      />
                      <span className="font-sans text-xs text-n-ink group-hover:text-n-rust transition-colors">
                        {p.firstName} {p.lastName}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </NidarosSection>
          )}

          {/* Spectators */}
          {game.spectators && game.spectators.length > 0 && (
            <NidarosSection title="Tilskuere" aside={`+${tournament.pointRules.spectator} p`}>
              <div className="flex flex-wrap gap-2">
                {game.spectators.map((p: Person, i: number) => {
                  const img = p.image ? urlForImage(p.image) : null;
                  return (
                    <Link
                      key={p._id}
                      href={`/players/${p._id}`}
                      className="flex items-center gap-2 bg-n-bg2 border border-n-line px-2.5 py-1.5 hover:border-n-rust transition-colors group"
                    >
                      <PlayerAvatar
                        firstName={p.firstName}
                        lastName={p.lastName}
                        imageSrc={img}
                        size="sm"
                        tone={i}
                      />
                      <span className="font-sans text-xs text-n-ink group-hover:text-n-rust transition-colors">
                        {p.firstName} {p.lastName}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </NidarosSection>
          )}
        </div>
      </div>
    </main>
  );
}
