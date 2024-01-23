import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const TournamentPointSystemCardSkeleton: React.FC = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Poengsystem</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 lg:grid-cols-4 space-y-1">
          <dt className="font-semibold">1. plass</dt>
          <dd>
            <Skeleton className="h-6 w-32" />
          </dd>

          <dt className="font-semibold">2. plass</dt>
          <dd>
            <Skeleton className="h-6 w-32" />
          </dd>

          <dt className="font-semibold">3. plass</dt>
          <dd>
            <Skeleton className="h-6 w-32" />
          </dd>

          <dt className="font-semibold">Arrangør (med deltakelse)</dt>
          <dd>
            <Skeleton className="h-6 w-32" />
          </dd>

          <dt className="font-semibold">Arrangør (uten deltakelse)</dt>
          <dd>
            <Skeleton className="h-6 w-32" />
          </dd>

          <dt className="font-semibold">Deltakelse</dt>
          <dd>
            <Skeleton className="h-6 w-32" />
          </dd>

          <dt className="font-semibold">Tilskuer</dt>
          <dd>
            <Skeleton className="h-6 w-32" />
          </dd>
        </dl>
      </CardContent>
    </Card>
  );
};

export default TournamentPointSystemCardSkeleton;
