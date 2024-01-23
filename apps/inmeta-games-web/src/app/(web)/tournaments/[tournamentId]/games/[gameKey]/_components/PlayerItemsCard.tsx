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

type Props = {
  title: React.ReactNode;
  description: React.ReactNode;
  players: Person[] | null;
  className?: string;
};

const PlayerItemsCard: React.FC<Props> = ({
  title,
  description,
  players,
  className,
}) => {
  return (
    <Card className={cn("mb-8", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-8">
          {players?.map((player) => (
            <PlayerItem key={player._id} player={player} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerItemsCard;
