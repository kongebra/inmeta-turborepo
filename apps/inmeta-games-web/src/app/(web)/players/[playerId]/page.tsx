import Heading from "@/components/heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { urlForImage } from "@/lib/sanity";
import { fetchPlayerDetails } from "@/lib/sanity/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = {
  playerId: string;
};

type Props = {
  params: Params;
};

export default async function PlayerDetailsPage({
  params: { playerId },
}: Props) {
  const player = await fetchPlayerDetails(playerId);

  if (!player) {
    return notFound();
  }

  const fullName = `${player.firstName} ${player.lastName}`;
  const imageSrc = urlForImage(player.image);

  const allGames = player.tournaments.flatMap((t) => t.games);
  const totalFirstPlaces = allGames.filter((g) => g.placement === 1).length;
  const totalParticipations = allGames.length;

  // Hot/Cold streak: check last 3 games
  const last3 = allGames.slice(-3);
  const allPodium =
    last3.length === 3 && last3.every((g) => g.placement >= 1 && g.placement <= 3);
  const allCold =
    last3.length === 3 && last3.every((g) => g.placement === 0);

  const printPlacement = (placement: number) => {
    switch (placement) {
      case 1:
        return "1. plass";
      case 2:
        return "2. plass";
      case 3:
        return "3. plass";
      default:
        return "Deltok";
    }
  };

  return (
    <main>
      <div className="container py-8">
        <div className="mb-8">
          <Link href={`/players`}>&larr; Gå tilbake til spilleroversikt</Link>
        </div>

        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <Heading>{fullName}</Heading>
          {player.spectatedGameCount > totalParticipations && (
            <span title="Ser mer på enn deltar!">👁️</span>
          )}
          {totalFirstPlaces === 0 && allGames.length > 0 && (
            <Badge variant="secondary">😔 Still Trying</Badge>
          )}
          {allPodium && <Badge>🔥 Hot Streak</Badge>}
          {allCold && <Badge variant="secondary">🧊 Cold Streak</Badge>}
        </div>

        <Image
          src={imageSrc}
          alt={fullName}
          width={256}
          height={256}
          className="rounded-md mb-8"
        />

        <Heading className="mb-8" size="h2">
          Deltakelser
        </Heading>

        {player.tournaments.map((tournament) => {
          return (
            <Card key={tournament._id}>
              <CardHeader>
                <CardTitle>{tournament.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tournament.games.map((game) => {
                    return (
                      <dl key={game._key}>
                        <dt className="font-bold">Spill</dt>
                        <dd>{game.name}</dd>

                        <dt className="font-bold">Plassering</dt>
                        <dd>{printPlacement(game.placement)}</dd>

                        <dt className="font-bold">Arrangør</dt>
                        <dd>{game.organizer ? "Ja 😎" : "Nei"}</dd>
                      </dl>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
