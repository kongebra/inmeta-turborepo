import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { urlForImage } from "@/lib/sanity";
import { TournamentDetails } from "@/lib/sanity/types";
import { calculateScoreboard } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import ConfettiOnMount from "./ConfettiOnMount";
import AnimatedScore from "./AnimatedScore";

type Props = {
  readonly tournament: TournamentDetails;
};

const TournamentScoreboardTable: React.FC<Props> = ({ tournament }) => {
  const scoreboard = calculateScoreboard(tournament);
  const lastRank =
    scoreboard.length > 0 ? scoreboard[scoreboard.length - 1].rank : 0;
  const midpoint = Math.floor(scoreboard.length / 2);

  return (
    <>
      <ConfettiOnMount />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead title="Plassering">#</TableHead>
            <TableHead>Bilde</TableHead>
            <TableHead>Navn</TableHead>
            <TableHead className="hidden lg:table-cell">Deltakelser</TableHead>
            <TableHead className="hidden lg:table-cell">Tilskuer</TableHead>
            <TableHead className="hidden lg:table-cell">
              1st / 2nd / 3rd
            </TableHead>
            <TableHead
              className="hidden lg:table-cell"
              title="Arrangør (med deltakelse/uten deltakelse)"
            >
              Arrangør (M / U)
            </TableHead>
            <TableHead>Poeng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scoreboard.map((item, index) => {
            const fullName = `${item.player.firstName} ${item.player.lastName}`;
            const initials = `${item.player.firstName.charAt(
              0
            )}${item.player.lastName.charAt(0)}`;

            const imageSrc = urlForImage(item.player.image);

            const isLast = item.rank === lastRank && scoreboard.length > 1;
            const isFirst = item.rank === 1;

            // Grayscale gradient: bottom half gets increasingly desaturated
            let grayscalePercent = 0;
            if (index >= midpoint && scoreboard.length > 1) {
              const bottomHalfIndex = index - midpoint;
              const bottomHalfTotal = scoreboard.length - midpoint - 1;
              grayscalePercent =
                bottomHalfTotal > 0
                  ? 20 + (80 * bottomHalfIndex) / bottomHalfTotal
                  : 20;
            }

            return (
              <TableRow
                key={item.player._id}
                className={isLast ? "animate-melt-drip origin-top" : ""}
                style={
                  grayscalePercent > 0
                    ? { filter: `grayscale(${Math.round(grayscalePercent)}%)` }
                    : undefined
                }
              >
                <TableCell className="font-bold">
                  {isFirst ? "👑 " : ""}
                  {item.rank}
                </TableCell>
                <TableCell>
                  <Avatar>
                    <AvatarImage asChild src={imageSrc}>
                      <Image
                        src={imageSrc}
                        alt={fullName}
                        width={40}
                        height={40}
                        className="grayscale hover:invert transition-all"
                      />
                    </AvatarImage>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{fullName}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {item.participations}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {item.spectatorCount}
                </TableCell>
                <TableCell
                  title={`${item.firstPlaces} førsteplasser. ${item.secondPlaces} andreplasser. ${item.thirdPlaces} tredjeplasser`}
                  className="font-mono hidden lg:table-cell"
                >{`${item.firstPlaces} / ${item.secondPlaces} / ${item.thirdPlaces}`}</TableCell>
                <TableCell
                  title={`${item.organizedWithParticipations} organisert med deltakelse. ${item.organizedWithtoutParticipations} organisert uten deltakelse.`}
                  className="font-mono hidden lg:table-cell"
                >{`${item.organizedWithParticipations} / ${item.organizedWithtoutParticipations}`}</TableCell>
                <TableCell className="font-bold">
                  <AnimatedScore value={item.score} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default TournamentScoreboardTable;
