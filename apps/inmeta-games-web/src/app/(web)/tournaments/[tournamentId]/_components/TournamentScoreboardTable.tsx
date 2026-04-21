import { Medal, PlayerAvatar, RankBadge } from "@/components/nidaros";
import { urlForImage } from "@/lib/sanity";
import { TournamentDetails } from "@/lib/sanity/types";
import { calculateScoreboard } from "@/lib/utils";
import React from "react";

type Props = { readonly tournament: TournamentDetails };

const TournamentScoreboardTable: React.FC<Props> = ({ tournament }) => {
  const scoreboard = calculateScoreboard(tournament);

  if (scoreboard.length === 0) {
    return (
      <div className="bg-n-bg2 border border-n-line p-6 text-center">
        <p className="font-mono text-[10px] text-n-muted uppercase tracking-[0.12em]">
          Ingen resultat ennå
        </p>
      </div>
    );
  }

  return (
    <div className="bg-n-bg2 border border-n-line">
      {/* Header */}
      <div className="grid grid-cols-[28px_36px_1fr_40px_64px_44px] gap-2.5 px-3 py-2.5 border-b border-n-line">
        {["#", "", "Navn", "Spill", "1·2·3", "Pt"].map((h, i) => (
          <span
            key={i}
            className="font-mono text-[8px] text-n-ink-dim uppercase tracking-[0.12em] text-right first:text-left [&:nth-child(3)]:text-left"
          >
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {scoreboard.map((item, i) => {
        const imageSrc = item.player.image ? urlForImage(item.player.image) : null;
        const isTop = item.rank <= 3;

        return (
          <div
            key={item.player._id}
            className={[
              "grid grid-cols-[28px_36px_1fr_40px_64px_44px] gap-2.5 px-3 py-2.5 items-center",
              i < scoreboard.length - 1 ? "border-b border-n-line-soft" : "",
              isTop ? "bg-gradient-to-r from-n-rust/5 to-transparent" : "",
            ].join(" ")}
          >
            <div className="flex items-center">
              <RankBadge rank={item.rank} />
            </div>
            <PlayerAvatar
              firstName={item.player.firstName}
              lastName={item.player.lastName}
              imageSrc={imageSrc}
              size="sm"
              tone={i}
            />
            <div className="min-w-0">
              <div className="font-sans text-[13px] text-n-ink font-medium truncate">
                {item.player.firstName} {item.player.lastName}
              </div>
            </div>
            <div className="font-mono text-[10px] text-n-ink-dim text-right">
              {item.participations}
            </div>
            <div className="font-mono text-[10px] text-n-ink-dim text-right">
              {item.firstPlaces}·{item.secondPlaces}·{item.thirdPlaces}
            </div>
            <div
              className={[
                "font-display text-[15px] text-right",
                isTop ? "text-n-messing" : "text-n-ink",
              ].join(" ")}
            >
              {item.score}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TournamentScoreboardTable;
