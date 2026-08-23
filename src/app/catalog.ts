import type { Lane, Roster } from "../data";

export interface CatalogFilters {
  lane: Lane | "all";
  connection: string | "all";
  financeOnly: boolean;
  query: string;
}

function searchText(roster: Roster): string {
  return [
    roster.name,
    roster.audience,
    roster.summary,
    ...roster.connections,
    roster.lead.name,
    roster.lead.title,
    roster.lead.owns,
    ...roster.specialists.flatMap((role) => [role.name, role.title, role.owns]),
  ]
    .join(" ")
    .toLocaleLowerCase();
}

export function searchRosters(items: readonly Roster[], query: string): Roster[] {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [...items];
  return items.filter((roster) => {
    const haystack = searchText(roster);
    return terms.every((term) => haystack.includes(term));
  });
}

export function filterRosters(items: readonly Roster[], filters: CatalogFilters): Roster[] {
  return searchRosters(items, filters.query).filter((roster) => {
    if (filters.financeOnly && roster.lane !== "finance") return false;
    if (filters.lane !== "all" && roster.lane !== filters.lane) return false;
    if (filters.connection !== "all" && !roster.connections.includes(filters.connection)) return false;
    return true;
  });
}

export function findRosterBySlug(items: readonly Roster[], slug: string): Roster {
  const fallback = items[0];
  if (!fallback) throw new Error("Roster collection cannot be empty");
  return items.find((roster) => roster.slug === slug) ?? fallback;
}

