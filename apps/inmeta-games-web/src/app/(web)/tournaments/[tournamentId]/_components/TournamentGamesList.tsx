import { Medal } from "@/components/nidaros";
import { urlForImage } from "@/lib/sanity";
import { TournamentDetails } from "@/lib/sanity/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = { readonly tournament: TournamentDetails };

const TournamentGamesList: React.FC<Props> = ({ tournament: { _id, games } }) => {
  return (
    <div className="divide-y divide-n-line-soft">
      {games.map((game, i) => {
        const img = game.image ? urlForImage(game.image) : null;
        const organizers = game.organiziers?.map((o) => o.firstName).join(", ") ?? "";

        return (
          <Link
            key={game._key}
            href={`/tournaments/${_id}/games/${game._key}`}
            className="group flex items-center gap-4 py-4 hover:bg-n-bg2 -mx-2 px-2 transition-colors"
          >
            {/* Index / status */}
            <div className="w-10 shrink-0 text-center">
              {game.isDone ? (
                <span className="font-mono text-[9px] text-n-skog uppercase tracking-[0.12em]">
                  ✓
                </span>
              ) : (
                <span className="font-mono text-[9px] text-n-muted uppercase tracking-[0.12em]">
                  {i + 1}
                </span>
              )}
            </div>

            {/* Thumbnail */}
            {img ? (
              <div className="w-12 h-12 shrink-0 relative overflow-hidden border border-n-line">
                <Image src={img} alt={game.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 shrink-0 bg-n-bg3 border border-n-line flex items-center justify-center">
                <span className="font-mono text-[8px] text-n-muted">{i + 1}</span>
              </div>
            )}

            {/* Name + organizer */}
            <div className="flex-1 min-w-0">
              <div className="font-display text-[15px] text-n-ink group-hover:text-n-rust transition-colors leading-tight">
                {game.name}
              </div>
              {organizers && (
                <div className="font-mono text-[9px] text-n-ink-dim uppercase tracking-[0.08em] mt-0.5">
                  Arr. {organizers}
                </div>
              )}
            </div>

            {/* Winner or pending */}
            <div className="shrink-0">
              {game.isDone && game.firstPlace && game.firstPlace.length > 0 ? (
                <div className="flex items-center gap-2">
                  <Medal rank={1} size="sm" />
                  <span className="font-sans text-xs text-n-ink hidden sm:block">
                    {game.firstPlace.map((p) => p.firstName).join(", ")}
                  </span>
                </div>
              ) : (
                <span className="font-mono text-[9px] text-n-muted uppercase tracking-[0.08em]">
                  {game.isDone ? "Ferdig" : "Venter"}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default TournamentGamesList;
