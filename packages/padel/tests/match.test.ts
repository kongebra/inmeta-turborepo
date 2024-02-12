import { Court } from "../src/court";
import { Match } from "../src/match";
import { Participant } from "../src/participant";
import { IParticipant, MatchScore } from "../src/types";

describe("Match", () => {
  const court = new Court("Court 1", "blue");
  const teamA: IParticipant = new Participant("Team 1");
  const teamB: IParticipant = new Participant("Team 2");

  it("should create an instance", () => {
    expect(new Match(court, [])).toBeTruthy();
  });

  it("should have teams", () => {
    const match = new Match(court, [teamA, teamB]);
    expect(match.teams).toEqual([teamA, teamB]);
  });

  it("should have a score", () => {
    const match = new Match(court, [teamA, teamB]);
    expect(match.score).toEqual([0, 0]);
  });

  it("should have a court", () => {
    const match = new Match(court, [teamA, teamB]);
    expect(match.court).toEqual(court);
  });

  it("should change score", () => {
    const match = new Match(court, [teamA, teamB]);
    const newScore: MatchScore = [6, 4];
    match.setScore(newScore);
    expect(match.score).toEqual(newScore);
  });
});
