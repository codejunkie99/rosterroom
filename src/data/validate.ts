import type { Roster } from "./types";

const textFields = ["name", "title", "owns"] as const;

export function validateRoster(roster: Roster): string[] {
  const errors: string[] = [];
  const roles = [roster.lead, ...roster.specialists];

  for (const [index, role] of roles.entries()) {
    const label = index === 0 ? "lead" : `specialist ${index}`;
    for (const field of textFields) {
      if (!role[field].trim()) errors.push(`${label} ${field} is required`);
    }
  }

  const botNames = roles.map((role) => role.name.trim().toLowerCase());
  if (new Set(botNames).size !== botNames.length) {
    errors.push("bot names must be unique within a roster");
  }

  if (roster.never.length < 3) errors.push("at least three never rules are required");

  if (roster.lane === "finance") {
    const rules = roster.never.join(" ").toLowerCase();
    if (!/(trade|order)/.test(rules)) errors.push("finance desks must forbid live trading");
    if (!/(move money|move funds|money movement|transfer funds)/.test(rules)) {
      errors.push("finance desks must forbid money movement");
    }
  }

  return errors;
}

export function validateRosterCollection(rosters: Roster[]): string[] {
  const errors = rosters.flatMap((roster) =>
    validateRoster(roster).map((error) => `${roster.slug}: ${error}`),
  );
  const slugs = rosters.map((roster) => roster.slug);
  if (new Set(slugs).size !== slugs.length) errors.push("roster slugs must be unique");
  return errors;
}
