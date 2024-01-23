import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

const TournamentScoreboardTableSkeleton: React.FC = () => {
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
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => {
          return (
            <TableRow key={item}>
              <TableCell className="font-bold">
                <Skeleton className="h-5 w-5" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-10 w-10 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-5" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-5" />
              </TableCell>
              <TableCell className="font-mono hidden lg:table-cell">
                <Skeleton className="h-5 w-20" />
              </TableCell>
              <TableCell className="font-mono hidden lg:table-cell">
                <Skeleton className="h-5 w-10" />
              </TableCell>
              <TableCell className="font-bold">
                <Skeleton className="h-5 w-5" />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TournamentScoreboardTableSkeleton;
