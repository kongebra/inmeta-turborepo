import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TournamentDetails } from "@/lib/sanity/types";
import Link from "next/link";
import React from "react";

type Props = {
  readonly tournament: TournamentDetails;
};

const TournamentGamesList: React.FC<Props> = ({
  tournament: { _id, games },
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
      {games.map((game) => (
        <Card key={game._key}>
          <CardHeader>
            <CardTitle>
              {game.name}
              {game.isDone ? " ✅" : null}
              {game.isDone &&
                game.isOrganizersParticipating &&
                game.firstPlace?.some((w) =>
                  game.organiziers?.some((o) => o._id === w._id)
                ) &&
                " ⚖️"}
            </CardTitle>
            <CardDescription>
              {`Arrangør: ${game.organiziers
                ?.map((o) => `${o.firstName}`)
                .join(", ")}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={`/tournaments/${_id}/games/${game._key}`}>
                {game.isDone ? "Se resultat" : "Se mer"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TournamentGamesList;
