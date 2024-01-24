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
        <CardTitle>Regler</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-4 space-y-1">
          <dt className="font-semibold col-span-3 lg:col-span-1">1. plass</dt>
          <dd className="text-right lg:text-left">
            {tournament.pointRules.firstPlace} poeng
          </dd>

          <dt className="font-semibold col-span-3 lg:col-span-1">2. plass</dt>
          <dd className="text-right lg:text-left">
            {tournament.pointRules.secondPlace} poeng
          </dd>

          <dt className="font-semibold col-span-3 lg:col-span-1">3. plass</dt>
          <dd className="text-right lg:text-left">
            {tournament.pointRules.thirdPlace} poeng
          </dd>

          <dt className="font-semibold col-span-3 lg:col-span-1">
            Arrangør (med deltakelse)
          </dt>
          <dd className="text-right lg:text-left">
            {tournament.pointRules.organizedWithParticipation} poeng
          </dd>

          <dt className="font-semibold col-span-3 lg:col-span-1">
            Arrangør (uten deltakelse)
          </dt>
          <dd className="text-right lg:text-left">
            {tournament.pointRules.organizedWithoutParticipation} poeng
          </dd>

          <dt className="font-semibold col-span-3 lg:col-span-1">Deltakelse</dt>
          <dd className="text-right lg:text-left">
            {tournament.pointRules.participation} poeng
          </dd>

          <dt className="font-semibold col-span-3 lg:col-span-1">Tilskuer</dt>
          <dd className="text-right lg:text-left">
            {tournament.pointRules.spectator} poeng
          </dd>
        </dl>
      </CardContent>
    </Card>
  );
};

export default TournamentPointSystemCard;
