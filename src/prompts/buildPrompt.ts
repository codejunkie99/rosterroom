import type { Role, Roster } from "../data/types";

function roleLine(role: Role): string {
  return `${role.name} — ${role.title}: owns ${role.owns}.`;
}

function neverBlock(roster: Roster): string {
  return [
    "GLOBAL APPROVAL GATE",
    "Human approval is required before sending, publishing, spending, deleting, contacting people, changing permissions, modifying live records, committing code, or deploying.",
    ...roster.never.map((rule) => `- Never ${rule}.`),
  ].join("\n");
}

export function buildSetupPrompt(roster: Roster): string {
  const teammates = roster.specialists.map(roleLine).join("\n");
  return [
    `Build the ${roster.name} roster for this workspace.`,
    "",
    `Rename yourself to ${roster.lead.name}. Your title is ${roster.lead.title}. You own ${roster.lead.owns}.`,
    `Create exactly ${roster.specialists.length} teammates and no others:`,
    teammates,
    "",
    `Connect ${roster.connections.join(", ")} before starting. If a required connection is unavailable, name the missing connection and continue only with work that does not depend on it.`,
    "",
    "OPERATING CONTRACT",
    "- The lead owns prioritization, delegation, quality control, and the final packet.",
    "- Specialists work only inside their stated ownership and return drafts to the lead.",
    "- Use source links, timestamps, assumptions, confidence, and unresolved questions.",
    "- Never claim an action, connection, file, teammate, or result exists unless it was verified.",
    neverBlock(roster),
    "",
    "CREATION CHECK",
    "If you cannot create teammates, say exactly: \"I cannot create the roster in this chat. Create the listed bots manually, select them together, then paste the fallback kickoff.\" Do not pretend the team exists. Stop after that sentence.",
    "",
    `When the roster is real, reply only with: lead name, teammates actually created, connections available, blocked connections, and readiness for the first job.`,
  ].join("\n");
}

export function buildFirstJobPrompt(roster: Roster): string {
  return [
    `FIRST JOB — ${roster.name}`,
    roster.firstTask,
    "",
    "Return one final packet with:",
    "1. executive readout",
    "2. work by owner",
    "3. sources and confidence",
    "4. assumptions and unresolved questions",
    "5. proposed next actions separated into safe-to-draft and approval-required",
    "",
    "Do not perform approval-required actions.",
  ].join("\n");
}

export function buildFallbackPrompt(roster: Roster): string {
  const names = [roster.lead.name, ...roster.specialists.map((role) => role.name)].join(", ");
  return [
    `Select ${names} in one group, then paste this kickoff.`,
    `Confirm which bots are actually present. Do not invent missing teammates.`,
    `${roster.lead.name} is the lead and delegates by the ownership written in each profile.`,
    neverBlock(roster),
    "",
    `First job: ${roster.firstTask}`,
    "Return one final packet through the lead. Draft only. Ask before every external side effect.",
  ].join("\n");
}

