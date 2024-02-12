import { Court } from "../src/court";

describe("Court", () => {
  it("should create an instance", () => {
    expect(new Court("Court 1", "blue")).toBeTruthy();
  });

  it("should have a name", () => {
    const courtName = "Court 1";
    const court = new Court(courtName, "blue");
    expect(court.name).toBe(courtName);
  });

  it("should have a color", () => {
    const courtColor = "blue";
    const court = new Court("Court 1", courtColor);
    expect(court.color).toBe(courtColor);
  });

  it("should change color", () => {
    const court = new Court("Court 1", "blue");
    const newColor = "red";
    court.setColor(newColor);
    expect(court.color).toBe(newColor);
  });
});
