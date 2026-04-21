import { Medal, NidarosSection, Skilt } from "@/components/nidaros";
import { urlForImage } from "@/lib/sanity";
import { fetchTournamentsList } from "@/lib/sanity/queries";
import { Tournament } from "@/lib/sanity/types";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 300;

function getTournamentStats(t: Tournament) {
  const done = t.games.filter((g) => g.isDone);
  const upcoming = t.games.find((g) => !g.isDone);
  const uniquePlayers = new Set(
    done.flatMap((g) => [
      ...(g.participants?.map((p) => p._ref) ?? []),
      ...(g.organiziers?.map((o) => o._ref) ?? []),
    ])
  );
  return {
    gamesPlayed: done.length,
    playerCount: uniquePlayers.size,
    nextGame: upcoming?.name ?? null,
    remaining: t.games.length - done.length,
  };
}

type StatusVariant = "rust" | "skog" | "muted" | "dark";
function tournamentStatus(t: Tournament): { label: string; variant: StatusVariant } {
  const hasAny = t.games.some((g) => g.isDone);
  const allDone = t.games.length > 0 && t.games.every((g) => g.isDone);
  if (allDone) return { label: "Ferdig", variant: "muted" };
  if (hasAny) return { label: "● Aktiv", variant: "skog" };
  return { label: "Planlagt", variant: "dark" };
}

export default async function Home() {
  const tournaments = await fetchTournamentsList();

  const featured =
    tournaments.find((t) => {
      const allDone = t.games.length > 0 && t.games.every((g) => g.isDone);
      return !allDone;
    }) ?? tournaments[0];

  const featuredStats = featured ? getTournamentStats(featured) : null;
  const doneGames = featured?.games.filter((g) => g.isDone) ?? [];
  const lastDoneGame = doneGames.length > 0 ? doneGames[doneGames.length - 1] : null;
  const lastGameImage = lastDoneGame?.image ? urlForImage(lastDoneGame.image) : null;

  return (
    <main>
      <div className="container py-8">
        {/* HERO */}
        {featured && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 mb-2">
            {/* Last game as hero */}
            <div className="relative overflow-hidden border border-n-line min-h-[280px] lg:min-h-0">
              {lastGameImage ? (
                <Image
                  src={lastGameImage}
                  alt={lastDoneGame?.name ?? ""}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a1810] via-[#1a1208] to-n-bg" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-n-bg/95 via-n-bg/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                {lastDoneGame && (
                  <Skilt variant="rust" className="mb-3 self-start">
                    Sist spilt
                  </Skilt>
                )}
                <div className="font-display text-4xl lg:text-5xl leading-none text-n-ink">
                  {lastDoneGame ? lastDoneGame.name : featured.name}
                </div>
                {lastDoneGame?.firstPlace && lastDoneGame.firstPlace.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <Medal rank={1} size="sm" />
                    <span className="font-sans text-sm text-n-ink">
                      {lastDoneGame.firstPlace.length === 1 ? "1 vinner" : `${lastDoneGame.firstPlace.length} vinnere`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Active tournament + stats */}
            <div className="flex flex-col gap-4">
              <div>
                <Skilt variant={tournamentStatus(featured).variant}>
                  {tournamentStatus(featured).label}
                </Skilt>
                <h1 className="font-display text-3xl lg:text-4xl leading-none mt-3 text-n-ink">
                  {featured.name}
                </h1>
                <p className="font-serif italic text-n-ink-dim text-base mt-2">
                  Går til den er ferdig.
                </p>
              </div>

              {/* Ad-hoc stats — cumulative, no fractions */}
              {featuredStats && (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    [String(featuredStats.gamesPlayed), "spilt så langt"],
                    [
                      featuredStats.playerCount > 0
                        ? String(featuredStats.playerCount)
                        : "—",
                      "spillere med",
                    ],
                    [featuredStats.nextGame ?? "—", "neste på listen"],
                    [
                      featuredStats.remaining > 0
                        ? String(featuredStats.remaining)
                        : "—",
                      "gjenstår",
                    ],
                  ].map(([val, label], i) => (
                    <div key={i} className="bg-n-bg2 border border-n-line p-3">
                      <div className="font-display text-2xl text-n-ink leading-none">
                        {val}
                      </div>
                      <div className="font-mono text-[8px] text-n-ink-dim uppercase tracking-[0.12em] mt-1.5">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Link
                href={`/tournaments/${featured._id}`}
                className="mt-auto border border-n-rust text-n-rust font-mono text-[10px] uppercase tracking-[0.12em] px-4 py-2.5 hover:bg-n-rust hover:text-n-paper transition-colors text-center"
              >
                Se hele turneringen →
              </Link>
            </div>
          </div>
        )}

        {/* RECENT GAMES */}
        {featured && featuredStats && featuredStats.gamesPlayed > 0 && (
          <NidarosSection title="Siste spill" aside="Kronologisk">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {featured.games
                .filter((g) => g.isDone)
                .slice(-4)
                .reverse()
                .map((game, i) => {
                  const img = game.image ? urlForImage(game.image) : null;
                  return (
                    <Link
                      key={game._key}
                      href={`/tournaments/${featured._id}/games/${game._key}`}
                      className="group bg-n-bg2 border border-n-line hover:border-n-rust transition-colors"
                    >
                      <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-[#2a1810] to-n-bg3">
                        {img && (
                          <Image
                            src={img}
                            alt={game.name}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-n-bg3/60 to-transparent" />
                      </div>
                      <div className="p-3">
                        <div className="font-mono text-[9px] text-n-rust uppercase tracking-[0.12em]">
                          Spill
                        </div>
                        <div className="font-display text-[17px] mt-1 text-n-ink leading-tight group-hover:text-n-rust transition-colors">
                          {game.name}
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </NidarosSection>
        )}

        {/* ALL TOURNAMENTS */}
        <NidarosSection
          title="Turneringer"
          aside={`${tournaments.length} totalt`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {tournaments.map((t) => {
              const { label, variant } = tournamentStatus(t);
              const stats = getTournamentStats(t);
              return (
                <Link
                  key={t._id}
                  href={`/tournaments/${t._id}`}
                  className="group bg-n-bg2 border border-n-line hover:border-n-rust transition-colors p-4"
                >
                  <Skilt variant={variant}>{label}</Skilt>
                  <div className="font-display text-xl mt-3 leading-tight text-n-ink group-hover:text-n-rust transition-colors">
                    {t.name}
                  </div>
                  <div className="flex gap-4 mt-3 font-mono text-[9px] text-n-ink-dim uppercase tracking-[0.12em]">
                    <span>{stats.gamesPlayed} spilt</span>
                    {stats.playerCount > 0 && (
                      <span>{stats.playerCount} spillere</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </NidarosSection>
      </div>
    </main>
  );
}
