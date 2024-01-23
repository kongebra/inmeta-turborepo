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
import React from "react";

type Props = {
  readonly tournament: TournamentDetails;
};

const TournamentScoreboardTable: React.FC<Props> = ({ tournament }) => {
  const scoreboard = calculateScoreboard(tournament);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
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
        {scoreboard.map((item) => {
          const fullName = `${item.player.firstName} ${item.player.lastName}`;
          const initials = `${item.player.firstName.charAt(
            0
          )}${item.player.lastName.charAt(0)}`;

          return (
            <TableRow key={item.player._id}>
              <TableCell className="font-bold">{item.rank}</TableCell>
              <TableCell>
                <Avatar>
                  <AvatarImage
                    src={urlForImage(item.player.image)}
                    alt={fullName}
                    className="grayscale hover:invert transition-all"
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{fullName}</TableCell>
              <TableCell>{item.participations}</TableCell>
              <TableCell>{item.spectatorCount}</TableCell>
              <TableCell
                title={`${item.firstPlaces} førsteplasser. ${item.secondPlaces} andreplasser. ${item.thirdPlaces} tredjeplasser`}
                className="font-mono hidden lg:table-cell"
              >{`${item.firstPlaces} / ${item.secondPlaces} / ${item.thirdPlaces}`}</TableCell>
              <TableCell
                title={`${item.organizedWithParticipations} organisert med deltakelse. ${item.organizedWithtoutParticipations} organisert uten deltakelse.`}
                className="font-mono hidden lg:table-cell"
              >{`${item.organizedWithParticipations} / ${item.organizedWithtoutParticipations}`}</TableCell>
              <TableCell className="font-bold">{item.score}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TournamentScoreboardTable;
