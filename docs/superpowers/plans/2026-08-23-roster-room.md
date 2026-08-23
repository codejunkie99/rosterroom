# Roster Room Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a polished static catalog containing 82 safe, original, copy-ready Grok Bot team rosters.

**Architecture:** A Vite + TypeScript single-page application reads validated roster objects and generates setup prompts through pure functions. A hash router opens roster dossiers, while search and lane filters operate entirely in the browser; GitHub Pages hosts the production build.

**Tech Stack:** TypeScript, Vite, Vitest, Testing Library DOM, modern CSS, GitHub Actions, GitHub Pages

---

### Task 1: Establish the project shell

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `index.html`
- Create: `src/main.ts`

- [ ] Add scripts for `dev`, `build`, `test`, `test:watch`, and `preview`, with Vite and Vitest as development dependencies.
- [ ] Add strict TypeScript configuration with DOM libraries and no emitted JavaScript.
- [ ] Add a minimal semantic application root and viewport metadata.
- [ ] Run `npm install`; expect a generated lockfile and exit code 0.
- [ ] Run `npm run build`; expect an initial production bundle.
- [ ] Commit with `chore: initialize roster room`.

### Task 2: Define and validate roster data

**Files:**
- Create: `src/data/types.ts`
- Create: `src/data/validate.ts`
- Test: `src/data/validate.test.ts`

- [ ] Write failing tests asserting that validation rejects empty roles, duplicate specialist names, missing permission boundaries, and finance desks without trade and money-movement prohibitions.
- [ ] Run `npm test -- src/data/validate.test.ts`; expect failures because validation is absent.
- [ ] Implement `Roster`, `Role`, `Lane`, and `RosterOrigin` types plus `validateRoster()` and `validateRosterCollection()`.
- [ ] Run the focused tests; expect all validation cases to pass.
- [ ] Commit with `feat: validate roster contracts`.

### Task 3: Generate safe copy-paste prompts

**Files:**
- Create: `src/prompts/buildPrompt.ts`
- Test: `src/prompts/buildPrompt.test.ts`

- [ ] Write failing tests for lead renaming, exact specialist creation, connection instructions, human-approval gates, truthful spawn failure, first-job output, and fallback kickoff.
- [ ] Run `npm test -- src/prompts/buildPrompt.test.ts`; expect failures because prompt builders are absent.
- [ ] Implement `buildSetupPrompt()`, `buildFirstJobPrompt()`, and `buildFallbackPrompt()` as pure functions over `Roster`.
- [ ] Run the focused tests; expect all prompt composition tests to pass.
- [ ] Commit with `feat: generate guarded roster prompts`.

### Task 4: Rebuild the original 32 job categories

**Files:**
- Create: `src/data/rebuilt.ts`
- Test: `src/data/rosters.test.ts`

- [ ] Write a failing collection test requiring 32 `origin: "rebuilt"` rosters, unique slugs, two to four specialists, and complete safety boundaries.
- [ ] Run `npm test -- src/data/rosters.test.ts`; expect a missing collection failure.
- [ ] Author original data for Solo founder, Fundraising, Sales desk, Agency pod, Support, Recruiting, Creator, Shop, Ship, Open source, Realtor, Small firm, Trades, Books, Inbox only, Household, Student, Expenses, Travel, Account health, Product, New hire, Trust, Partnerships, Newsletter, Rentals, Wedding, Podcast, Grants, School, Analytics, and Paid media.
- [ ] Run the focused test; expect all 32 rebuilt rosters to validate.
- [ ] Commit with `feat: add 32 rebuilt desks`.

### Task 5: Add 50 expansion desks

**Files:**
- Create: `src/data/finance.ts`
- Create: `src/data/expansion.ts`
- Create: `src/data/index.ts`
- Test: `src/data/rosters.test.ts`

- [ ] Extend the failing collection test to require exactly 50 expansion desks, exactly 82 total desks, and at least 30 finance-lane desks.
- [ ] Run the test; expect count and finance-coverage failures.
- [ ] Author finance, hedge fund, quant, trading, risk, compliance, fund operations, insurance, data, security, operations, communications, and professional-service rosters with original role names and first tasks.
- [ ] Export a single validated `rosters` collection.
- [ ] Run the focused test; expect 82 valid, unique rosters and finance safety coverage.
- [ ] Commit with `feat: add 50 specialist desks`.

### Task 6: Implement search, filters, and hash routing

**Files:**
- Create: `src/app/catalog.ts`
- Test: `src/app/catalog.test.ts`

- [ ] Write failing tests for case-insensitive search across desk names, roles, summaries, and connections; lane filtering; finance-only filtering; and slug resolution.
- [ ] Run `npm test -- src/app/catalog.test.ts`; expect missing-function failures.
- [ ] Implement `searchRosters()`, `filterRosters()`, and `findRosterBySlug()` as pure functions.
- [ ] Run the focused tests; expect all catalog behavior to pass.
- [ ] Commit with `feat: add roster discovery logic`.

### Task 7: Build the dossier interface

**Files:**
- Create: `src/app/render.ts`
- Create: `src/app/controller.ts`
- Modify: `src/main.ts`
- Test: `src/app/render.test.ts`

- [ ] Write failing DOM tests for the 82-desk count, numbered roster index, visible disclaimer, selected dossier, filter updates, hash navigation, and accessible copy buttons.
- [ ] Run `npm test -- src/app/render.test.ts`; expect rendering failures.
- [ ] Implement semantic rendering and event delegation for selection, filters, shareable hash routes, and clipboard writes with a textarea fallback.
- [ ] Run the focused tests; expect rendered behavior and copy labels to pass.
- [ ] Commit with `feat: build copy-ready dossier interface`.

### Task 8: Apply the visual system and brand asset

**Files:**
- Create: `src/styles.css`
- Create: `public/grok-logo.svg`
- Create: `public/roster-room-mark.svg`
- Modify: `index.html`

- [ ] Download xAI’s official supplied Grok SVG without alteration and record its source in the README.
- [ ] Create an original Roster Room SVG mark that does not combine with or imitate xAI’s mark.
- [ ] Implement a warm-paper editorial palette, Instrument Sans plus Newsreader typography, asymmetrical index/detail layout, strong focus states, 44px touch targets, and reduced-motion handling.
- [ ] Separate the official compatibility mark from the product identity and place the unofficial disclaimer beside it.
- [ ] Run `npm run build`; expect no missing assets or CSS build warnings.
- [ ] Commit with `feat: apply roster room visual system`.

### Task 9: Document and automate the repository

**Files:**
- Create: `README.md`
- Create: `LICENSE`
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/pages.yml`

- [ ] Document setup, architecture, roster schema, safety contract, contribution rules, brand separation, and copy-paste usage.
- [ ] Add MIT licensing for original code and text while excluding third-party marks from the license grant.
- [ ] Add CI that installs with `npm ci`, runs tests, and builds.
- [ ] Add GitHub Pages deployment from the Vite `dist` artifact on `main`.
- [ ] Run `npm test && npm run build`; expect zero failures and exit code 0.
- [ ] Commit with `docs: prepare public release`.

### Task 10: Verify and publish

**Files:**
- Modify only files required by verification findings.

- [ ] Start `npm run dev -- --host 127.0.0.1` and inspect the desktop and mobile layouts in a real browser.
- [ ] Exercise search, finance filter, desk selection, all three copy actions, and a direct hash URL.
- [ ] Run `npm test`, `npm run build`, and `git status --short`; expect passing tests, a successful build, and only intentional files.
- [ ] Create the public `codejunkie99/rosterroom` GitHub repository, add `origin`, and push `main`.
- [ ] Enable GitHub Pages through Actions and wait for both CI and deployment runs.
- [ ] Re-query repository visibility, default branch, latest commit, Actions status, and Pages URL before reporting completion.

