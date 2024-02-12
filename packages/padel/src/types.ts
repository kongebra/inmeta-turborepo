export interface IParticipant {
  readonly id: string;
  readonly name: string;

  /**
   * Represents the score per round.
   */
  readonly score: number[];
  readonly totalScore: number;

  /**
   * Represents the wins per round.
   */
  readonly wins: boolean[];

  addScore(score: number, win: boolean): void;
}

export type MatchScore = [number, number];

export interface IMatch {
  readonly teams: ReadonlyArray<IParticipant>;
  readonly score: MatchScore;
  readonly court: ICourt;

  setScore(score: MatchScore): void;
}

export interface ICourt {
  readonly name: string;
  readonly color: string;

  setColor(color: string): void;
}

export interface IRound {
  readonly matches: ReadonlyArray<IMatch>;

  /**
   * The players that have passed to the next round.
   * They will be rewarded with half the points of the tournament scoring.
   * If tournament scoring is odd, the points will be rounded up.
   */
  readonly passingPlayers: ReadonlyArray<IParticipant>;

  addMatch(court: ICourt, teams: IParticipant[]): void;
  setMatchScore(matchIndex: number, score: MatchScore): void;
  addPassingPlayer(player: IParticipant): void;
}

export type TournamentType = "americano" | "mexicano";
export type TournamentMode = "individual" | "team";
export type TournamentScoring = "11" | "16" | "21" | "24";
export type TournamentFinalPairing = "12-34" | "13-24" | "14-23";
export type TournamentStatus = "settings" | "playing" | "finished";

export interface ITournament {
  readonly name: string;
  readonly type: TournamentType;
  readonly mode: TournamentMode;
  readonly scoring: TournamentScoring;
  readonly finalPairing: TournamentFinalPairing;
  readonly status: TournamentStatus;
  readonly canStart: boolean;

  readonly courts: ReadonlyArray<ICourt>;
  readonly participants: ReadonlyArray<IParticipant>;
  readonly rounds: ReadonlyArray<IRound>;

  addParticipant(name: string): void;
  removeParticipant(index: number): void;

  addCourt(name: string): void;
  removeCourt(index: number): void;

  startTournament(): void;
  endTournament(): void;

  //   setType(type: TournamentType): void;
  setMode(mode: TournamentMode): void;
  setScoring(scoring: TournamentScoring): void;
  setFinalPairing(finalPairing: TournamentFinalPairing): void;

  nextRound(): void;

  setMatchScore(
    roundIndex: number,
    matchIndex: number,
    score: MatchScore
  ): void;

  changeCourtColor(courtIndex: number, color: string): void;
}
