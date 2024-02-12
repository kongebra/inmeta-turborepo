import { Match } from "./match";
import { ICourt, IMatch, IParticipant, IRound, MatchScore } from "./types";

export class Round implements IRound {
  private _matches: IMatch[];
  private _passingPlayers: IParticipant[];

  constructor() {
    this._matches = [];
    this._passingPlayers = [];
  }

  get matches() {
    return this._matches;
  }

  get passingPlayers() {
    return this._passingPlayers;
  }

  addMatch(court: ICourt, teams: IParticipant[]): void {
    this._matches.push(new Match(court, teams));
  }

  setMatchScore(matchIndex: number, score: MatchScore): void {
    if (matchIndex >= 0 && matchIndex < this._matches.length) {
      this._matches[matchIndex].setScore(score);
    }
  }

  addPassingPlayer(player: IParticipant): void {
    this._passingPlayers.push(player);
  }
}
