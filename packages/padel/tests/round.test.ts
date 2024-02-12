import { Court, IParticipant } from "../src";
import { Participant } from "../src/participant";
import { Round } from "../src/round";

describe("Round", () => {
  const blueCourt = new Court("Blue Court", "blue");
  const redCourt = new Court("Red Court", "red");

  const playerOne: IParticipant = new Participant("Player 1");
  const playerTwo: IParticipant = new Participant("Player 2");

  it("should create an instance", () => {
    expect(new Round()).toBeTruthy();
  });

  it("should add a match", () => {
    const round = new Round();
    round.addMatch(blueCourt, [playerOne, playerTwo]);
    expect(round.matches.length).toBe(1);
  });

  it("should set match score", () => {
    const round = new Round();
    round.addMatch(blueCourt, [playerOne, playerTwo]);
    round.setMatchScore(0, [6, 4]);
    expect(round.matches[0].score).toEqual([6, 4]);
  });

  it("should add passing player", () => {
    const round = new Round();
    round.addPassingPlayer(playerOne);
    expect(round.passingPlayers.length).toBe(1);
  });

  it("should not set match score if match index is out of range", () => {
    const round = new Round();
    round.addMatch(blueCourt, [playerOne, playerTwo]);
    round.setMatchScore(1, [6, 4]);
    expect(round.matches[0].score).toEqual([0, 0]);
  });

  it("should not set match score if match index is negative", () => {
    const round = new Round();
    round.addMatch(blueCourt, [playerOne, playerTwo]);
    round.setMatchScore(-1, [6, 4]);
    expect(round.matches[0].score).toEqual([0, 0]);
  });
});
