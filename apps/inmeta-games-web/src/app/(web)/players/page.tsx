import Heading from "@/components/heading";
import { urlForImage } from "@/lib/sanity";
import { fetchPlayers } from "@/lib/sanity/queries";
import { sortPeople } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Spillere - Inmeta Games",
  description: "En oversikt over alle spillerne i Inmeta Games",
} satisfies Metadata;

export default async function PlayersPage() {
  const players = await fetchPlayers();

  return (
    <main>
      <div className="container py-8">
        <div className="mb-8">
          <Link href={`/`}>&larr; Gå tilbake til forsiden</Link>
        </div>

        <Heading className="mb-8">Spillere</Heading>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {players.sort(sortPeople).map((player) => {
            const fullName = `${player.firstName} ${player.lastName}`;

            return (
              <Link
                key={player._id}
                className="flex flex-col gap-4 dark:bg-slate-700 dark:hover:bg-slate-800 bg-slate-50 hover:bg-slate-200 p-2 rounded-md transition-colors"
                href={`/players/${player._id}`}
              >
                <Image
                  src={urlForImage(player.image)}
                  alt={fullName}
                  width={512}
                  height={512}
                  className="rounded-md grayscale hover:grayscale-0 transition-all"
                />
                <span className="font-semibold">{fullName}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
