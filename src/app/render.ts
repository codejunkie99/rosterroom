import { lanes, type Roster } from "../data/types";
import { buildFallbackPrompt, buildFirstJobPrompt, buildSetupPrompt } from "../prompts/buildPrompt";
import type { CatalogFilters } from "./catalog";

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character] ?? character;
  });
}

function laneLabel(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function roleHtml(roster: Roster): string {
  const roles = [roster.lead, ...roster.specialists];
  return roles
    .map(
      (role, index) => `
        <li class="role ${index === 0 ? "role--lead" : ""}">
          <span class="role__index">${index === 0 ? "LEAD" : String(index).padStart(2, "0")}</span>
          <div>
            <strong>${escapeHtml(role.name)}</strong>
            <span>${escapeHtml(role.title)}</span>
            <p>${escapeHtml(role.owns)}</p>
          </div>
        </li>`,
    )
    .join("");
}

function deskRows(items: readonly Roster[], selected: Roster): string {
  if (items.length === 0) {
    return `<div class="empty"><strong>No desk matches that brief.</strong><span>Try a role, connection, or wider lane.</span></div>`;
  }
  return items
    .map(
      (roster, index) => `
        <button class="desk-row ${roster.slug === selected.slug ? "is-selected" : ""}" data-roster="${escapeHtml(roster.slug)}" aria-label="Open ${escapeHtml(roster.name)}">
          <span class="desk-row__number">${String(index + 1).padStart(2, "0")}</span>
          <span class="desk-row__body">
            <strong>${escapeHtml(roster.name)}</strong>
            <span>${escapeHtml(roster.summary)}</span>
          </span>
          <span class="desk-row__meta">${roster.specialists.length + 1} bots<br>${escapeHtml(laneLabel(roster.lane))}</span>
          <span class="desk-row__arrow" aria-hidden="true">↗</span>
        </button>`,
    )
    .join("");
}

function connectionOptions(items: readonly Roster[], selected: string): string {
  const connections = [...new Set(items.flatMap((roster) => roster.connections))].sort();
  return ["all", ...connections]
    .map((connection) => {
      const label = connection === "all" ? "Any connection" : connection;
      return `<option value="${escapeHtml(connection)}" ${connection === selected ? "selected" : ""}>${escapeHtml(label)}</option>`;
    })
    .join("");
}

export function renderCatalog(
  allRosters: readonly Roster[],
  selected: Roster,
  filters: CatalogFilters,
  visibleRosters: readonly Roster[] = allRosters,
): string {
  const base = import.meta.env.BASE_URL;
  const setupPrompt = buildSetupPrompt(selected);
  const firstJob = buildFirstJobPrompt(selected);
  const fallback = buildFallbackPrompt(selected);
  const financeCount = allRosters.filter((roster) => roster.lane === "finance").length;

  return `
    <header class="masthead">
      <a class="brand" href="#desk/${allRosters[0]?.slug ?? ""}" aria-label="Roster Room home">
        <img src="${base}roster-room-mark.svg" alt="" width="46" height="46">
        <span><strong>Roster Room</strong><small>Human-gated agent teams</small></span>
      </a>
      <div class="compat">
        <img src="${base}grok-logo.svg" alt="Grok logo" width="30" height="30">
        <span><strong>For Grok Bot</strong><small>Unofficial community project. Not affiliated with or endorsed by xAI.</small></span>
      </div>
    </header>

    <main id="main-content">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero__copy">
          <p class="eyebrow">THE OPEN ROSTER INDEX / 2026</p>
          <h1 id="hero-title"><span>82</span> desks.<br>One paste.<br><em>Zero chaos.</em></h1>
        </div>
        <div class="hero__note">
          <p>Original operating teams for founders, builders, creators, funds, and trading desks. Every roster researches and drafts freely. Every external action stays behind human approval.</p>
          <div class="hero__stats"><span><b>32</b> rebuilt</span><span><b>50</b> new</span><span><b>${financeCount}</b> finance</span></div>
        </div>
      </section>

      <section class="catalog-shell" aria-label="Roster catalog">
        <aside class="directory" aria-label="Desk directory">
          <div class="filters">
            <label class="search-label" for="desk-search">Search 82 desks</label>
            <div class="search-wrap"><span aria-hidden="true">⌕</span><input id="desk-search" type="search" value="${escapeHtml(filters.query)}" placeholder="role, job, connection…" autocomplete="off"></div>
            <div class="lane-filters" aria-label="Filter by lane">
              <button class="filter-chip ${filters.lane === "all" && !filters.financeOnly ? "is-active" : ""}" data-lane="all">All</button>
              ${lanes
                .filter((lane) => lane !== "finance")
                .map((lane) => `<button class="filter-chip ${filters.lane === lane && !filters.financeOnly ? "is-active" : ""}" data-lane="${lane}">${laneLabel(lane)}</button>`)
                .join("")}
              <button class="filter-chip filter-chip--finance ${filters.financeOnly ? "is-active" : ""}" data-finance aria-pressed="${filters.financeOnly}">Finance only</button>
            </div>
            <label class="connection-filter">Connection
              <select id="connection-filter">${connectionOptions(allRosters, filters.connection)}</select>
            </label>
            <div class="result-count"><span>${visibleRosters.length}</span> desks in view</div>
          </div>
          <div class="desk-list" aria-live="polite">${deskRows(visibleRosters, selected)}</div>
        </aside>

        <article class="dossier" aria-labelledby="desk-title">
          <div class="dossier__head">
            <div>
              <p class="eyebrow">${escapeHtml(selected.lane.toUpperCase())} / ${selected.origin === "rebuilt" ? "REBUILT" : "NEW DESK"}</p>
              <h2 id="desk-title">${escapeHtml(selected.name)}</h2>
              <p class="audience">${escapeHtml(selected.audience)}</p>
            </div>
            <span class="bot-count">${selected.specialists.length + 1}<small>bots</small></span>
          </div>

          <p class="summary">${escapeHtml(selected.summary)}</p>

          <div class="connection-strip"><span>CONNECT FIRST</span>${selected.connections.map((connection) => `<b>${escapeHtml(connection)}</b>`).join("")}</div>

          <section class="roster-section" aria-labelledby="roster-title">
            <div class="section-label"><span>01</span><h3 id="roster-title">The roster</h3></div>
            <ol class="roles">${roleHtml(selected)}</ol>
          </section>

          <section class="guard-section" aria-labelledby="guard-title">
            <div class="section-label"><span>02</span><h3 id="guard-title">Hard boundary</h3></div>
            <div class="guard-box">
              <strong>NEVER, WITHOUT HUMAN APPROVAL</strong>
              <ul>${selected.never.map((rule) => `<li>${escapeHtml(rule)}</li>`).join("")}</ul>
            </div>
          </section>

          <section class="prompt-section" aria-labelledby="prompt-title">
            <div class="section-label"><span>03</span><h3 id="prompt-title">Copy the desk</h3></div>
            <div class="copy-bar">
              <button class="copy-button copy-button--primary" data-copy="setup">Copy full setup</button>
              <button class="copy-button" data-copy="first">Copy first job</button>
              <button class="copy-button" data-copy="fallback">Copy fallback</button>
            </div>
            <p class="copy-status" role="status" aria-live="polite"></p>
            <details class="prompt-preview">
              <summary>Inspect full setup prompt</summary>
              <pre>${escapeHtml(setupPrompt)}</pre>
            </details>
            <details class="prompt-preview">
              <summary>Inspect first job</summary>
              <pre>${escapeHtml(firstJob)}</pre>
            </details>
            <details class="prompt-preview">
              <summary>Inspect fallback kickoff</summary>
              <pre>${escapeHtml(fallback)}</pre>
            </details>
          </section>
        </article>
      </section>
    </main>

    <footer>
      <div><strong>Roster Room</strong><span>82 original rosters. Human approval by default.</span></div>
      <p>Unofficial community project. Grok and its logo are trademarks of xAI. Not affiliated with or endorsed by xAI.</p>
    </footer>`;
}

