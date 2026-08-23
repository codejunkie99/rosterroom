import { expansionRosters } from "./expansion";
import { rebuiltRosters } from "./rebuilt";
import { validateRosterCollection } from "./validate";

export const rosters = [...rebuiltRosters, ...expansionRosters];

const errors = validateRosterCollection(rosters);
if (errors.length > 0) {
  throw new Error(`Invalid roster collection:\n${errors.join("\n")}`);
}

export type { Lane, Role, Roster, RosterOrigin } from "./types";

