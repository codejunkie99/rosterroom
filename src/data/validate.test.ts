import { describe, expect, it } from "vitest";
import type { Roster } from "./types";
import { validateRoster, validateRosterCollection } from "./validate";

const baseRoster: Roster = {
  slug: "founder-office",
  name: "Founder office",
  lane: "founder",
  origin: "rebuilt",
  audience: "One operator, clear ownership",
  summary: "Turns incoming work into an owned weekly operating queue.",
  connections: ["Gmail", "Calendar"],
  never: ["send messages", "spend money", "change live records"],
  lead: { name: "Anchor", title: "Chief of Staff", owns: "priorities, delegation, and final drafts" },
  specialists: [
    { name: "Signal", title: "Researcher", owns: "source-backed research" },
    { name: "Clock", title: "Scheduler", owns: "calendar options and conflicts" },
  ],
  firstTask: "Build a source-linked weekly brief with decisions, owners, and open questions. Send nothing.",
};

describe("validateRoster", () => {
  it("accepts a complete guarded roster", () => {
    expect(validateRoster(baseRoster)).toEqual([]);
  });

  it("rejects empty role fields", () => {
    const roster = { ...baseRoster, lead: { ...baseRoster.lead, owns: "" } };
    expect(validateRoster(roster)).toContain("lead owns is required");
  });

  it("rejects duplicate bot names", () => {
    const roster = {
      ...baseRoster,
      specialists: [{ ...baseRoster.specialists[0], name: baseRoster.lead.name }],
    };
    expect(validateRoster(roster)).toContain("bot names must be unique within a roster");
  });

  it("rejects missing permission boundaries", () => {
    expect(validateRoster({ ...baseRoster, never: [] })).toContain("at least three never rules are required");
  });

  it("requires finance desks to forbid trading and money movement", () => {
    const roster = { ...baseRoster, lane: "finance" as const };
    expect(validateRoster(roster)).toContain("finance desks must forbid live trading");
    expect(validateRoster(roster)).toContain("finance desks must forbid money movement");
  });
});

describe("validateRosterCollection", () => {
  it("rejects duplicate slugs", () => {
    expect(validateRosterCollection([baseRoster, { ...baseRoster }])).toContain(
      "roster slugs must be unique",
    );
  });
});

