import { TournamentDetails } from "@/lib/sanity/types";
import React from "react";

type Props = { readonly tournament: TournamentDetails };

const TournamentPointSystemCard: React.FC<Props> = ({ tournament }) => {
  const rules = [
    ["1. plass", tournament.pointRules.firstPlace],
    ["2. plass", tournament.pointRules.secondPlace],
    ["3. plass", tournament.pointRules.thirdPlace],
    ["Deltakelse", tournament.pointRules.participation],
    ["Arr m/ delta", tournament.pointRules.organizedWithParticipation],
    ["Arr u/ delta", tournament.pointRules.organizedWithoutParticipation],
    ["Tilskuer", tournament.pointRules.spectator],
  ] as [string, number][];

  return (
    <details className="bg-n-bg2 border border-n-line-soft group">
      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer font-mono text-[9px] text-n-ink-dim uppercase tracking-[0.12em] list-none hover:text-n-ink transition-colors">
        <span>Se poengeregler</span>
        <span className="group-open:rotate-45 transition-transform inline-block text-base leading-none">+</span>
      </summary>
      <div className="px-4 pb-4 grid grid-cols-2 gap-x-6 gap-y-1.5 border-t border-n-line-soft">
        {rules.map(([label, pts]) => (
          <div key={label} className="flex justify-between">
            <span className="font-mono text-[10px] text-n-ink-dim">{label}</span>
            <span className="font-mono text-[10px] text-n-rust">{pts} p</span>
          </div>
        ))}
      </div>
    </details>
  );
};

export default TournamentPointSystemCard;
