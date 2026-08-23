import type { Lane, Role, Roster, RosterOrigin } from "./types";

type RoleTuple = readonly [name: string, title: string, owns: string];

interface RosterInput {
  slug: string;
  name: string;
  lane: Lane;
  origin: RosterOrigin;
  audience: string;
  summary: string;
  connections: string[];
  lead: RoleTuple;
  bots: RoleTuple[];
  task: string;
  never?: string[];
}

const standardNever = [
  "send messages or contact people without explicit approval",
  "spend money, make purchases, or accept terms",
  "change, delete, publish, file, deploy, or overwrite live records",
];

const financeNever = [
  ...standardNever,
  "place, modify, or cancel live trades or orders",
  "move money, transfer funds, or change custody instructions",
  "provide personalized investment advice, make suitability decisions, or submit regulatory filings",
];

function role([name, title, owns]: RoleTuple): Role {
  return { name, title, owns };
}

export function roster(input: RosterInput): Roster {
  return {
    slug: input.slug,
    name: input.name,
    lane: input.lane,
    origin: input.origin,
    audience: input.audience,
    summary: input.summary,
    connections: input.connections,
    never: input.never ?? (input.lane === "finance" ? financeNever : standardNever),
    lead: role(input.lead),
    specialists: input.bots.map(role),
    firstTask: input.task,
  };
}

