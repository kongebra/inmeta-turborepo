import { ICourt, IMatch, IParticipant } from "./types";

export class Match implements IMatch {
  private _teams: IParticipant[];
  private _score: [number, number];
  private _court: ICourt;

  constructor(court: ICourt, teams: IParticipant[]) {
    this._teams = teams;
    this._score = [0, 0];
    this._court = court;
  }

  get teams() {
    return this._teams;
  }

  get score() {
    return this._score;
  }

  get court() {
    return this._court;
  }

  setScore(score: [number, number]): void {
    this._score = score;
  }
}
