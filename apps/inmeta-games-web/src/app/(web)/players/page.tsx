import { PlayerAvatar } from "@/components/nidaros";
import { urlForImage } from "@/lib/sanity";
import { fetchPlayers } from "@/lib/sanity/queries";
import { sortPeople } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata = {
  title: "Spillere — Trønder Leikan",
  description: "Alle spillere i Inmeta Games Trondheim",
} satisfies Metadata;

export default async function PlayersPage() {
  const players = await fetchPlayers();

  return (
    <main>
      <div className="container py-8">
        <div className="font-mono text-[10px] text-n-ink-dim uppercase tracking-[0.12em] mb-4">
          <Link href="/" className="hover:text-n-ink transition-colors">
            ← Tilbake til forsiden
          </Link>
        </div>

        <h1 className="font-display text-4xl lg:text-5xl leading-none text-n-ink mb-2">
          Spillere
        </h1>
        <p className="font-serif italic text-n-ink-dim text-base mb-8">
          {players.length} registrerte spillere
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {players.sort(sortPeople).map((player, i) => {
            const imageSrc = player.image ? urlForImage(player.image) : null;
            const fullName = `${player.firstName} ${player.lastName}`;
            return (
              <Link
                key={player._id}
                href={`/players/${player._id}`}
                className="group flex flex-col gap-3 bg-n-bg2 border border-n-line hover:border-n-rust p-3 transition-colors"
              >
                <div className="aspect-square relative overflow-hidden bg-n-bg3">
                  {imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageSrc}
                      alt={fullName}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayerAvatar
                        firstName={player.firstName}
                        lastName={player.lastName}
                        size="lg"
                        tone={i}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-display text-[13px] text-n-ink group-hover:text-n-rust transition-colors leading-tight">
                    {player.firstName}
                  </div>
                  <div className="font-sans text-[11px] text-n-ink-dim">
                    {player.lastName}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
