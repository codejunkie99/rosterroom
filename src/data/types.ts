export const lanes = [
  "founder",
  "revenue",
  "build",
  "practice",
  "life",
  "finance",
  "operations",
  "security",
  "people",
  "communications",
] as const;

export type Lane = (typeof lanes)[number];
export type RosterOrigin = "rebuilt" | "expansion";

export interface Role {
  name: string;
  title: string;
  owns: string;
}

export interface Roster {
  slug: string;
  name: string;
  lane: Lane;
  origin: RosterOrigin;
  audience: string;
  summary: string;
  connections: string[];
  never: string[];
  lead: Role;
  specialists: Role[];
  firstTask: string;
}

