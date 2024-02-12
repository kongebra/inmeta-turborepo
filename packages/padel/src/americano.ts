import { Match } from "./match";
import { Round } from "./round";
import { Tournament } from "./tournament";
import { IParticipant, IRound } from "./types";

export class AmericanoTournament extends Tournament {
  constructor(name: string) {
    super(name);

    this._type = "americano";
  }

  get canStart(): boolean {
    if (this._status !== "settings") {
      return false;
    }

    if (this._courts.length === 0) {
      return false;
    }

    if (this._participants.length < 4) {
      return false;
    }

    return true;
  }

  startTournament(): void {
    if (!this.canStart) {
      return;
    }

    this._status = "playing";

    const numberOfParticipants = this._participants.length;
    const numberOfRounds = numberOfParticipants - 1;
    const matchesPerRound = this._courts.length;

    for (let r = 0; r < numberOfRounds; r++) {
      const round = new Round();

      for (let m = 0; m < matchesPerRound; m++) {
        const court = this._courts[m];
        const teams: IParticipant[] = [];
        if (this._mode === "individual") {
          // we need to add 4 participants
          // team A = [participant1, participant2]
          // team B = [participant3, participant4]
          // teams = [participant1, participant2, participant3, participant4]
        }

        if (this._mode === "team") {
          // we only need to add 2 participants
        }

        const match = new Match(court, teams);
      }

      this._rounds.push(round);
    }

    // TODO:
  }

  endTournament(): void {
    throw new Error("Method not implemented.");
  }

  nextRound(): void {
    // TODO: not much to do here
  }
}
