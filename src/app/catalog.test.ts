import { describe, expect, it } from "vitest";
import { rosters } from "../data";
import { filterRosters, findRosterBySlug, searchRosters } from "./catalog";

describe("catalog discovery", () => {
  it("searches desk names, roles, summaries, and connections without case sensitivity", () => {
    expect(searchRosters(rosters, "HEDGE FUND").map((roster) => roster.name)).toContain("Hedge fund CIO");
    expect(searchRosters(rosters, "statistical reviewer").map((roster) => roster.name)).toContain("Quant research");
    expect(searchRosters(rosters, "survivorship").map((roster) => roster.name)).toContain("Quant research");
    expect(searchRosters(rosters, "shopify").map((roster) => roster.name)).toContain("Commerce control");
  });

  it("filters by lane, connection, and finance shortcut", () => {
    expect(filterRosters(rosters, { lane: "security", connection: "all", financeOnly: false, query: "" })).toHaveLength(3);
    expect(filterRosters(rosters, { lane: "all", connection: "GitHub", financeOnly: false, query: "" }).length).toBeGreaterThan(5);
    expect(filterRosters(rosters, { lane: "all", connection: "all", financeOnly: true, query: "" })).toHaveLength(34);
  });

  it("resolves a direct roster slug and returns the first desk for an unknown slug", () => {
    expect(findRosterBySlug(rosters, "quant-research").name).toBe("Quant research");
    expect(findRosterBySlug(rosters, "missing").slug).toBe(rosters[0]?.slug);
  });
});
