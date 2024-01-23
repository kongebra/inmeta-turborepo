import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTournamentsList } from "@/lib/sanity/queries";
import { unstable_noStore } from "next/cache";
import Link from "next/link";

export default async function Home() {
  unstable_noStore();
  const tournaments = await fetchTournamentsList();

  return (
    <main>
      <div className="max-w-screen-sm mx-auto p-8 min-h-screen bg-black/5 dark:bg-white/5">
        <Heading className="mb-8">Velkommen til Inmeta Games!</Heading>

        <Heading className="mb-8" size="h2">
          Turneringer
        </Heading>

        <div className="grid gap-4">
          {tournaments.map((tournament) => (
            <Card key={tournament._id}>
              <CardHeader>
                <CardTitle>{tournament.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href={`/tournaments/${tournament._id}`}>Se mer</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
