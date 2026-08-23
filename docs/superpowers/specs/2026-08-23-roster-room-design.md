# Roster Room Design

## Product

Roster Room is a public, static catalog of 82 original team rosters designed for copy-paste use with Grok Bot. It rebuilds the 32 jobs represented by Bot Teams with clearer roles, safer permission boundaries, stronger first tasks, and better failure handling, then adds 50 new desks with deep coverage of finance, hedge funds, quantitative research, trading operations, risk, and compliance.

The audience is founders, operators, creators, developers, investors, analysts, and professional-services teams who want an immediately usable multi-agent starting point without designing an organization from scratch. The core action is copying a complete setup prompt in one click.

## Identity and brand boundary

The product name is **Roster Room**, not Grok or xAI. Its tone is an editorial trading-floor dossier: warm paper, dense black typography, acid-chartreuse action color, red risk annotations, and disciplined motion. The interface uses the official Grok logo only as supplied by xAI, adjacent to an accurate compatibility statement. It is never altered, combined into the Roster Room mark, or used in the repository name.

Every page carries: “Unofficial community project. Not affiliated with or endorsed by xAI.” The README links to xAI’s brand guidelines. The site does not claim the roster text was produced by Grok.

## Information architecture

The landing view is a two-pane roster index rather than a repeated card wall:

- A compact header identifies Roster Room, the 82-desk count, compatibility, and the unofficial-project disclaimer.
- A filter rail offers full-text search, lane filters, connection filters, and a finance-only shortcut.
- A numbered dossier index lists every desk with its lane, bot count, one-line purpose, and required connections.
- Selecting a desk opens a detailed dossier with its lead, specialists, explicit “Never” boundary, required connections, setup prompt, first job, and fallback kickoff.
- Primary actions are “Copy full setup,” “Copy first job,” and “Copy fallback.” Copy actions provide visible success feedback and retain keyboard focus.
- Hash routes make every desk shareable and remain compatible with GitHub Pages.

## Roster model

Each roster has one accountable lead and two to four specialists. Data fields are `slug`, `name`, `lane`, `origin`, `audience`, `summary`, `connections`, `never`, `lead`, `specialists`, and `firstTask`. The `origin` field distinguishes the 32 rebuilt job categories from the 50 expansion desks.

Setup prompts are generated from structured data. They tell the first bot to rename itself to the lead role, create only the listed specialists, delegate by ownership, return drafts to the lead, report actual creation failures, and preserve human control over external side effects.

## Safety model

All rosters default to read, research, analyze, organize, and draft. Sending, publishing, spending, deleting, modifying live records, contacting people, changing permissions, and committing or deploying require explicit human approval.

Finance and trading desks add stronger boundaries: never place or cancel orders, move money, change live strategies, submit filings, make suitability decisions, or provide personalized investment advice. Legal, medical, hiring, housing, insurance, and education desks prohibit final high-impact decisions and regulated advice.

## Architecture

The repository is a Vite + TypeScript static application. Roster data lives in focused TypeScript modules, prompt composition lives in a pure function, and the UI consumes only validated roster objects. No backend, authentication, tracking, or runtime API is required.

Vitest covers schema invariants, exact roster counts, unique slugs, finance coverage, safety boundaries, prompt composition, search, and filter behavior. Vite produces the deployable site. A GitHub Actions workflow runs tests and the production build on pushes and pull requests; a Pages workflow deploys `dist` from `main`.

## Acceptance criteria

- Exactly 82 original rosters: 32 rebuilt job categories plus 50 expansion desks.
- At least 30 expansion desks cover finance, investment management, trading, risk, compliance, and fund operations.
- Every roster produces a complete copyable setup prompt, first job, and fallback kickoff.
- Every roster has explicit permission boundaries; finance rosters have trading and money-movement prohibitions.
- Search, lane filters, finance shortcut, hash routing, and all copy controls work on desktop and mobile.
- Official Grok logo remains unmodified and visually separated from Roster Room branding.
- The unofficial-project disclaimer is visible in the header, detail view, footer, and README.
- `npm test`, `npm run build`, and browser smoke tests pass before publication.

