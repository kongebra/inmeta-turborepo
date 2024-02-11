import CreateTournamentForm from "./_components/create-tournament-form";

export default function Home(): JSX.Element {
  return (
    <main>
      <div className="container mx-auto py-4">
        <CreateTournamentForm />
      </div>
    </main>
  );
}
