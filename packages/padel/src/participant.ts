import { IParticipant } from "./types";

export class Participant implements IParticipant {
  private _id: string;
  private _name: string;
  private _score: number[];
  private _wins: boolean[];

  constructor(name: string) {
    this._id = Math.random().toString(36).substring(2, 9);
    this._name = name;
    this._score = [];
    this._wins = [];
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get score() {
    return this._score;
  }

  get totalScore() {
    return this.score.reduce((acc, score) => acc + score, 0);
  }

  get wins() {
    return this._wins;
  }

  addScore(score: number, win: boolean): void {
    this._score.push(score);
    this._wins.push(win);
  }
}
