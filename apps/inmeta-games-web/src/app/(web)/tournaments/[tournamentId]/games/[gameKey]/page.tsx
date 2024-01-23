import Heading from "@/components/heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchTournamentDetails } from "@/lib/sanity/queries";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { urlForImage } from "@/lib/sanity";
import PlayerItemsCard from "./_components/PlayerItemsCard";

type Params = {
  tournamentId: string;
  gameKey: string;
};

type Props = {
  params: Params;
};

export async function generateMetadata({
  params: { tournamentId, gameKey },
}: Props) {
  const tournament = await fetchTournamentDetails(tournamentId);
  const game = tournament?.games.find((game) => game._key === gameKey);
  if (!tournament || !game) {
    return notFound();
  }

  return {
    title: `${game.name} - ${tournament.name} - Inmeta Games`,
    description: `Resultater for ${game.name} i ${tournament.name}`,
  };
}

export default async function TournamentGamesPage({
  params: { tournamentId, gameKey },
}: Props) {
  unstable_noStore();

  const tournament = await fetchTournamentDetails(tournamentId);
  const game = tournament?.games.find((game) => game._key === gameKey);
  if (!tournament || !game) {
    return notFound();
  }

  return (
    <main>
      <div className="container py-8">
        <div className="mb-8">
          <Link href={`/tournaments/${tournamentId}`}>
            &larr; Gå tilbake til turneringen
          </Link>
        </div>

        <Heading className="mb-8">{game.name}</Heading>

        <div className="grid grid-cols-12 gap-8 mb-8">
          <dl className="col-span-12 lg:col-span-4">
            <dt className="font-bold mb-4">
              {!!game.organiziers && game.organiziers?.length > 1
                ? "Arrangører"
                : "Arrangør"}
            </dt>
            {game.organiziers?.map((o) => {
              const fullName = `${o.firstName} ${o.lastName}`;
              const initials = `${o.firstName.charAt(0)}${o.lastName.charAt(
                0
              )}`;

              return (
                <dd key={o._id} className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={urlForImage(o.image)} alt={fullName} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>

                  <span>{fullName}</span>
                </dd>
              );
            })}
          </dl>

          <dl className="col-span-12 lg:col-span-8">
            <dt className="font-bold mb-4">Beskrivelse</dt>
            <dd className="">{game.description}</dd>
          </dl>
        </div>

        <PlayerItemsCard
          title="Førsteplass"
          description="3 poeng for førsteplass"
          players={game.firstPlace}
          className="border-amber-500 border-4"
        />
        <PlayerItemsCard
          title="Andreplass"
          description="2 poeng for andreplass"
          players={game.secondPlace}
          className="border-slate-300 border-4"
        />
        <PlayerItemsCard
          title="Tredjeplass"
          description="1 poeng for tredjeplass"
          players={game.thirdPlace}
          className="border-amber-800 border-4"
        />
        <PlayerItemsCard
          title="Deltakere"
          description="3 poeng for deltakelse"
          players={game.participants}
        />
        <PlayerItemsCard
          title="Tilskuere"
          description="1 poeng for tilskuere"
          players={game.spectators}
        />
      </div>
    </main>
  );
}
