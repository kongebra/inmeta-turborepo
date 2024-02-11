import TournamentCourtCard from "./tournament-court-card";
import TournamentFormatCard from "./tournament-format-card";
import TournamentParticipantsCard from "./tournament-participants-card";
import TournamentScoringCard from "./tournament-scoring-card";
import TournamentTypeCard from "./tournament-type-card";

export default function CreateTournamentForm() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="grid gap-4">
        <TournamentTypeCard />
        <TournamentFormatCard />
        <TournamentScoringCard />
      </div>
      <div className="grid gap-4">
        <TournamentCourtCard />
      </div>
      <div className="grid gap-4">
        <TournamentParticipantsCard />
      </div>
    </div>
  );
}
