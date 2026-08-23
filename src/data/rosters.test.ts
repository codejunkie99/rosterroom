import { describe, expect, it } from "vitest";
import { buildSetupPrompt } from "../prompts/buildPrompt";
import { expansionRosters } from "./expansion";
import { financeRosters } from "./finance";
import { rosters } from "./index";
import { rebuiltRosters } from "./rebuilt";
import { validateRosterCollection } from "./validate";

describe("roster collection", () => {
  it("gives all 32 rebuilt categories distinct new public identities", () => {
    const expectedNames = [
      "Founder command",
      "Capital raise",
      "Revenue floor",
      "Client studio",
      "Resolution desk",
      "Talent bench",
      "Content engine",
      "Commerce control",
      "Release room",
      "Maintainer guild",
      "Property desk",
      "Practice office",
      "Field operations",
      "Close desk",
      "Mailroom",
      "Home office",
      "Study stack",
      "Spend control",
      "Journey desk",
      "Customer watch",
      "Product council",
      "Ramp room",
      "Assurance desk",
      "Alliance desk",
      "Editorial issue",
      "Property operations",
      "Event command",
      "Audio studio",
      "Funding desk",
      "Family desk",
      "Decision intelligence",
      "Growth media",
    ];
    expect(rebuiltRosters.map((roster) => roster.name)).toEqual(expectedNames);
    expect(new Set(rebuiltRosters.map((roster) => roster.slug)).size).toBe(32);
  });

  it("contains exactly 32 rebuilt and 50 expansion desks", () => {
    expect(rebuiltRosters).toHaveLength(32);
    expect(expansionRosters).toHaveLength(50);
    expect(rosters).toHaveLength(82);
  });

  it("contains deep finance coverage", () => {
    expect(financeRosters.length).toBeGreaterThanOrEqual(30);
    expect(financeRosters.map((roster) => roster.name)).toEqual(
      expect.arrayContaining([
        "Hedge fund CIO",
        "Quant research",
        "Systematic trading",
        "Execution desk",
        "Options volatility",
        "Portfolio construction",
        "Model validation",
        "Fund administration",
      ]),
    );
  });

  it("keeps every roster valid, unique, and operationally bounded", () => {
    expect(validateRosterCollection(rosters)).toEqual([]);
    expect(new Set(rosters.map((roster) => roster.slug)).size).toBe(82);
    for (const roster of rosters) {
      expect(roster.specialists.length).toBeGreaterThanOrEqual(2);
      expect(roster.specialists.length).toBeLessThanOrEqual(4);
      expect(roster.firstTask.length).toBeGreaterThan(45);
      expect(buildSetupPrompt(roster)).toContain("GLOBAL APPROVAL GATE");
    }
  });

  it("marks the original job set and the new expansion separately", () => {
    expect(rebuiltRosters.every((roster) => roster.origin === "rebuilt")).toBe(true);
    expect(expansionRosters.every((roster) => roster.origin === "expansion")).toBe(true);
  });
});
