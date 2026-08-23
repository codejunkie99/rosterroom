import { describe, expect, it } from "vitest";
import type { Roster } from "../data/types";
import { buildFallbackPrompt, buildFirstJobPrompt, buildSetupPrompt } from "./buildPrompt";

const roster: Roster = {
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

describe("buildSetupPrompt", () => {
  it("creates an exact, guarded team setup", () => {
    const prompt = buildSetupPrompt(roster);
    expect(prompt).toContain("Rename yourself to Anchor");
    expect(prompt).toContain("Create exactly 2 teammates");
    expect(prompt).toContain("Signal — Researcher");
    expect(prompt).toContain("Clock — Scheduler");
    expect(prompt).toContain("Connect Gmail, Calendar before starting");
    expect(prompt).toContain("Human approval is required before sending, publishing, spending, deleting");
    expect(prompt).toContain("If you cannot create teammates");
    expect(prompt).toContain("Do not pretend the team exists");
  });
});

describe("buildFirstJobPrompt", () => {
  it("returns the first task with a concrete reporting contract", () => {
    const prompt = buildFirstJobPrompt(roster);
    expect(prompt).toContain(roster.firstTask);
    expect(prompt).toContain("Return one final packet");
    expect(prompt).toContain("sources and confidence");
  });
});

describe("buildFallbackPrompt", () => {
  it("coordinates an already-created group without inventing bots", () => {
    const prompt = buildFallbackPrompt(roster);
    expect(prompt).toContain("Select Anchor, Signal, Clock");
    expect(prompt).toContain("Confirm which bots are actually present");
    expect(prompt).toContain(roster.firstTask);
  });
});

