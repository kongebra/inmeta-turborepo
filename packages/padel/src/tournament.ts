import { Court } from "./court";
import { Participant } from "./participant";
import {
  ICourt,
  IParticipant,
  IRound,
  ITournament,
  MatchScore,
  TournamentFinalPairing,
  TournamentMode,
  TournamentScoring,
  TournamentStatus,
  TournamentType,
} from "./types";

export abstract class Tournament implements ITournament {
  protected _name: string;
  protected _type: TournamentType;
  protected _mode: TournamentMode;
  protected _scoring: TournamentScoring;
  protected _finalPairing: TournamentFinalPairing;
  protected _status: TournamentStatus;
  protected _courts: ICourt[];
  protected _participants: IParticipant[];
  protected _rounds: IRound[];

  constructor(name: string) {
    this._name = name;
    this._type = "americano";
    this._mode = "individual";
    this._scoring = "24";
    this._finalPairing = "13-24";
    this._status = "settings";
    this._courts = [];
    this._participants = [];
    this._rounds = [];
  }

  abstract get canStart(): boolean;

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
  }

  get mode() {
    return this._mode;
  }

  get scoring() {
    return this._scoring;
  }

  get finalPairing() {
    return this._finalPairing;
  }

  get status() {
    return this._status;
  }

  get courts(): ReadonlyArray<ICourt> {
    return [...this._courts];
  }

  get participants(): ReadonlyArray<IParticipant> {
    return [...this._participants];
  }

  get rounds(): ReadonlyArray<IRound> {
    return [...this._rounds];
  }

  addParticipant(name: string): void {
    this._participants.push(new Participant(name));
  }

  removeParticipant(index: number): void {
    if (index >= 0 && index < this._participants.length) {
      this._participants.splice(index, 1);
    }
  }

  addCourt(name: string): void {
    this._courts.push(new Court(name, "blue"));
  }

  removeCourt(index: number): void {
    if (index >= 0 && index < this._courts.length) {
      this._courts.splice(index, 1);
    }
  }

  abstract startTournament(): void;
  abstract endTournament(): void;

  //   setType(type: TournamentType): void {
  //     this._type = type;
  //   }

  setMode(mode: TournamentMode): void {
    if (this._mode !== mode) {
      this._mode = mode;
      this._participants = [];
    }
  }

  setScoring(scoring: TournamentScoring): void {
    this._scoring = scoring;
  }

  setFinalPairing(finalPairing: TournamentFinalPairing): void {
    this._finalPairing = finalPairing;
  }

  abstract nextRound(): void;

  setMatchScore(
    roundIndex: number,
    matchIndex: number,
    score: MatchScore
  ): void {
    this._rounds[roundIndex].matches[matchIndex].setScore(score);
  }

  changeCourtColor(courtIndex: number, color: string): void {
    this._courts[courtIndex].setColor(color);
  }
}
