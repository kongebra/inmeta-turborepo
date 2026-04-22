import { Medal, NidarosSection, Skilt } from "@/components/nidaros";
import { urlForImage } from "@/lib/sanity";
import { fetchPlayerDetails } from "@/lib/sanity/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { playerId: string };
type Props = { params: Params };

const placementLabels: Record<number, string> = {
  1: "1. plass",
  2: "2. plass",
  3: "3. plass",
};

export default async function PlayerDetailsPage({ params: { playerId } }: Props) {
  const player = await fetchPlayerDetails(playerId);
  if (!player) return notFound();

  const fullName = `${player.firstName} ${player.lastName}`;
  const imageSrc = player.image ? urlForImage(player.image) : null;

  // Calculate overall stats
  const allGames = player.tournaments.flatMap((t) => t.games);
  const wins = allGames.filter((g) => g.placement === 1).length;
  const podiums = allGames.filter((g) => g.placement > 0 && g.placement <= 3).length;
  const organized = allGames.filter((g) => g.organizer).length;

  return (
    <main>
      <div className="container py-8">
        <div className="font-mono text-[10px] text-n-ink-dim uppercase tracking-[0.12em] mb-4">
          <Link href="/players" className="hover:text-n-ink transition-colors">
            ← Alle spillere
          </Link>
        </div>

        {/* Profile header */}
        <div className="grid grid-cols-[auto_1fr] gap-6 mb-2">
          <div className="relative">
            {imageSrc ? (
              <div className="w-24 h-24 lg:w-32 lg:h-32 relative overflow-hidden border-2 border-n-line">
                <Image
                  src={imageSrc}
                  alt={fullName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-n-bg3 border-2 border-n-line flex items-center justify-center">
                <span className="font-display text-2xl text-n-ink-dim">
                  {player.firstName.charAt(0)}{player.lastName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            {wins > 0 && (
              <Skilt variant="messing" className="mb-2 self-start">
                {wins === 1 ? "1 seier" : `${wins} seiere`}
              </Skilt>
            )}
            <h1 className="font-display text-3xl lg:text-4xl leading-none text-n-ink">
              {player.firstName}
              <br />
              <span className="text-n-ink-dim">{player.lastName}</span>
            </h1>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-6">
          {[
            [String(allGames.length), "Spill totalt"],
            [String(wins), "Seiere"],
            [String(podiums), "Podieplasser"],
            [String(organized), "Arrangert"],
          ].map(([val, label], i) => (
            <div key={i} className="bg-n-bg2 border border-n-line p-3">
              <div className="font-display text-2xl text-n-ink leading-none">{val}</div>
              <div className="font-mono text-[8px] text-n-ink-dim uppercase tracking-[0.12em] mt-1.5">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Tournament history */}
        <NidarosSection title="Turneringshistorikk" className="mt-4">
          {player.tournaments.length === 0 ? (
            <div className="bg-n-bg2 border border-n-line p-6 text-center">
              <p className="font-mono text-[10px] text-n-muted uppercase tracking-[0.12em]">
                Ingen deltakelser ennå
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {player.tournaments.map((tournament) => (
                <div key={tournament._id} className="bg-n-bg2 border border-n-line">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-n-line-soft">
                    <Link
                      href={`/tournaments/${tournament._id}`}
                      className="font-display text-[17px] text-n-ink hover:text-n-rust transition-colors"
                    >
                      {tournament.name}
                    </Link>
                    <span className="font-mono text-[9px] text-n-ink-dim uppercase tracking-[0.12em]">
                      {tournament.games.length} spill
                    </span>
                  </div>
                  <div className="divide-y divide-n-line-soft">
                    {tournament.games.map((game) => (
                      <div
                        key={game._key}
                        className="flex items-center gap-4 px-4 py-3"
                      >
                        <div className="w-8 flex items-center justify-center shrink-0">
                          {game.placement > 0 && game.placement <= 3 ? (
                            <Medal rank={game.placement} size="sm" />
                          ) : game.placement > 0 ? (
                            <span className="font-mono text-[10px] text-n-ink-dim">
                              {game.placement}.
                            </span>
                          ) : game.organizer ? (
                            <span className="font-mono text-[8px] text-n-rust uppercase">
                              Arr
                            </span>
                          ) : (
                            <span className="font-mono text-[8px] text-n-muted">
                              Del
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-display text-[14px] text-n-ink">
                            {game.name}
                          </div>
                          {game.organizer && (
                            <div className="font-mono text-[8px] text-n-rust uppercase tracking-[0.08em] mt-0.5">
                              Arrangør
                            </div>
                          )}
                        </div>
                        <div className="font-mono text-[10px] text-n-ink-dim">
                          {placementLabels[game.placement] ?? "Deltok"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </NidarosSection>
      </div>
    </main>
  );
}
