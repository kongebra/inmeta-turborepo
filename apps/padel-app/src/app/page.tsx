import { Button } from "@inmeta/ui/button";
import CreateTournamentForm from "./_components/create-tournament-form";
import StartTournamentButton from "./_components/start-tournament-button";

export default function Home() {
  return (
    <>
      <header>
        <nav className="border-b py-2 mb-4">
          <div className="container mx-auto flex items-center justify-between">
            <span className="font-bold text-lg">Inmeta Games (Padel)</span>

            <StartTournamentButton />
          </div>
        </nav>
      </header>

      <main>
        <div className="container mx-auto py-4">
          <CreateTournamentForm />
        </div>
      </main>
    </>
  );
}
