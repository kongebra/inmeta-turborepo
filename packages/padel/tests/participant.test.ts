import { Participant } from "../src/participant";

describe("Participant", () => {
  it("should create an instance", () => {
    expect(new Participant("Player 1")).toBeTruthy();
  });

  it("should have an id", () => {
    const player = new Participant("Player 1");
    expect(player.id).toBeTruthy();
  });

  it("should have a name", () => {
    const playerName = "Player 1";
    const player = new Participant(playerName);
    expect(player.name).toBe(playerName);
  });

  it("should have a score", () => {
    const player = new Participant("Player 1");
    expect(player.score).toEqual([]);
  });

  it("should have a total score", () => {
    const player = new Participant("Player 1");
    expect(player.totalScore).toBe(0);
  });

  it("should have wins", () => {
    const player = new Participant("Player 1");
    expect(player.wins).toEqual([]);
  });

  it("should add score", () => {
    const player = new Participant("Player 1");
    player.addScore(6, true);
    expect(player.score).toEqual([6]);
    expect(player.wins).toEqual([true]);
  });

  it("should calculate total score", () => {
    const player = new Participant("Player 1");
    player.addScore(6, true);
    player.addScore(4, false);
    expect(player.totalScore).toBe(10);
  });

  it("should calculate total score with no scores", () => {
    const player = new Participant("Player 1");
    expect(player.totalScore).toBe(0);
  });

  it("should calculate total score with negative scores", () => {
    const player = new Participant("Player 1");
    player.addScore(-6, true);
    player.addScore(-4, false);
    expect(player.totalScore).toBe(-10);
  });
});
