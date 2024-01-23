import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TournamentDetails } from "@/lib/sanity/types";
import React from "react";

type Props = {
  readonly tournament: TournamentDetails;
};

const TournamentPointSystemCard: React.FC<Props> = ({ tournament }) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Poengsystem</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          <dt className="font-semibold">1. plass</dt>
          <dd>{tournament.pointRules.firstPlace} poeng</dd>

          <dt className="font-semibold">2. plass</dt>
          <dd>{tournament.pointRules.secondPlace} poeng</dd>

          <dt className="font-semibold">3. plass</dt>
          <dd>{tournament.pointRules.thirdPlace} poeng</dd>

          <dt className="font-semibold">Arrangør (med deltakelse)</dt>
          <dd>{tournament.pointRules.organizedWithParticipation} poeng</dd>

          <dt className="font-semibold">Arrangør (uten deltakelse)</dt>
          <dd>{tournament.pointRules.organizedWithoutParticipation} poeng</dd>

          <dt className="font-semibold">Deltakelse</dt>
          <dd>{tournament.pointRules.participation} poeng</dd>

          <dt className="font-semibold">Tilskuer</dt>
          <dd>{tournament.pointRules.spectator} poeng</dd>
        </dl>
      </CardContent>
    </Card>
  );
};

export default TournamentPointSystemCard;
