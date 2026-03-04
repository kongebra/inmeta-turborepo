import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Person } from "@/lib/sanity/types";
import React from "react";
import PlayerItem from "./PlayerItem";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  title: React.ReactNode;
  description: React.ReactNode;
  players: Person[] | null;
  className?: string;
  skeleton?: boolean;
  dimPlayers?: boolean;
};

const PlayerItemsCard: React.FC<Props> = ({
  title,
  description,
  players,
  className,
  skeleton,
  dimPlayers,
}) => {
  return (
    <Card className={cn("mb-8", className)}>
      <CardHeader>
        <CardTitle>
          {skeleton ? <Skeleton className="h-6 w-32" /> : title}
        </CardTitle>
        <CardDescription>
          {skeleton ? <Skeleton className="h-4 w-64" /> : description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {skeleton ? (
          <div className="flex flex-wrap gap-8">
            <PlayerItem skeleton />
            <PlayerItem skeleton />
            <PlayerItem skeleton />
          </div>
        ) : (
          <div className="flex flex-wrap gap-8">
            {players?.map((player) => (
              <PlayerItem key={player._id} player={player} dimmed={dimPlayers} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerItemsCard;
