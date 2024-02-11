import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";

export interface Player {
  id: string;
  name: string;
  placement: number | undefined;
  scores: number[];
  totalScore: number;
  wins: boolean[];
  playedAgainstCounters: Record<string, number>;
  playedWithCounters: Record<string, number>;
}

export interface Team {
  players: Player[];
  score: number | null;
}

export interface Match {
  id: number;
  teams: Team[];
}

export interface Court {
  id: string;
  name: string;
  color: string;
}

export interface Round {
  isFinal: boolean;
  matches: Match[];
  passingPlayers: unknown[];
}

export type TournamentType = "americano" | "mexicano";
export type ScoringType = "11" | "16" | "21" | "24";
export type TournamentFormat = "individual" | "team";

export interface TournamentState {
  type: TournamentType;
  setType: (type: TournamentType) => void;

  format: TournamentFormat;
  setFormat: (format: TournamentFormat) => void;

  scoring: ScoringType;
  setScoring: (scoring: ScoringType) => void;

  participants: Player[];
  addParticipant: (name: string) => void;
  removeParticipant: (id: string) => void;

  rounds: Round[];
  addRound: () => void;

  courts: Court[];
  addCourt: (name: string) => void;
  removeCourt: (id: string) => void;
}

export const useTournamentStore = create<
  TournamentState,
  [["zustand/persist", TournamentState]]
>(
  persist(
    (set) => ({
      type: "americano",
      setType: (type) => {
        set({ type });
      },

      format: "individual",
      setFormat: (format) => {
        set({ format, participants: [] });
      },

      scoring: "24",
      setScoring: (scoring) => {
        set({ scoring });
      },

      participants: [],
      addParticipant: (name) => {
        set((state) => ({
          participants: [
            ...state.participants,
            {
              id: uuid(),
              name,
              placement: undefined,
              scores: [],
              totalScore: 0,
              wins: [],
              playedAgainstCounters: {},
              playedWithCounters: {},
            },
          ],
        }));
      },
      removeParticipant: (id) => {
        set((state) => ({
          participants: state.participants.filter((p) => p.id !== id),
        }));
      },

      courts: [],
      addCourt: (name) => {
        set((state) => ({
          courts: [
            ...state.courts,
            {
              id: uuid(),
              name,
              color: "red",
            },
          ],
        }));
      },
      removeCourt: (id) => {
        set((state) => ({
          courts: state.courts.filter((c) => c.id !== id),
        }));
      },

      rounds: [],
      addRound: () => {
        set((state) => ({
          rounds: [
            ...state.rounds,
            {
              isFinal: false,
              matches: [],
              passingPlayers: [],
            },
          ],
        }));
      },
    }),
    {
      name: "tournament-storage",
    }
  )
);
