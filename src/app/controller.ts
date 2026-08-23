import type { Roster } from "../data";
import { buildFallbackPrompt, buildFirstJobPrompt, buildSetupPrompt } from "../prompts/buildPrompt";
import { filterRosters, findRosterBySlug, type CatalogFilters } from "./catalog";
import { renderCatalog } from "./render";

interface ClipboardWriter {
  writeText(text: string): Promise<void>;
}

async function fallbackCopy(text: string): Promise<void> {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.append(area);
  area.select();
  const copied = document.execCommand("copy");
  area.remove();
  if (!copied) throw new Error("Clipboard access is unavailable");
}

function hashSlug(): string {
  const match = window.location.hash.match(/^#desk\/(.+)$/);
  return match?.[1] ?? "";
}

export function createApp(
  root: HTMLElement,
  items: readonly Roster[],
  clipboard: ClipboardWriter = navigator.clipboard ?? { writeText: fallbackCopy },
): () => void {
  let selected = findRosterBySlug(items, hashSlug());
  let filters: CatalogFilters = { lane: "all", connection: "all", financeOnly: false, query: "" };

  const render = (focusSearch = false): void => {
    const visible = filterRosters(items, filters);
    if (visible.length > 0 && !visible.some((roster) => roster.slug === selected.slug)) {
      selected = visible[0]!;
    }
    root.innerHTML = renderCatalog(items, selected, filters, visible);
    if (focusSearch) {
      const input = root.querySelector<HTMLInputElement>("#desk-search");
      input?.focus();
      input?.setSelectionRange(input.value.length, input.value.length);
    }
  };

  const onInput = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.id !== "desk-search") return;
    filters = { ...filters, query: target.value };
    render(true);
  };

  const onChange = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement) || target.id !== "connection-filter") return;
    filters = { ...filters, connection: target.value };
    render();
  };

  const copyPrompt = async (kind: string): Promise<void> => {
    const prompts: Record<string, { text: string; label: string }> = {
      setup: { text: buildSetupPrompt(selected), label: "Full setup copied" },
      first: { text: buildFirstJobPrompt(selected), label: "First job copied" },
      fallback: { text: buildFallbackPrompt(selected), label: "Fallback copied" },
    };
    const prompt = prompts[kind];
    if (!prompt) return;
    const status = root.querySelector<HTMLElement>("[role='status']");
    try {
      await clipboard.writeText(prompt.text);
      if (status) status.textContent = prompt.label;
    } catch {
      if (status) status.textContent = "Copy failed. Open the prompt and copy it manually.";
    }
  };

  const onClick = (event: MouseEvent): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const rosterButton = target.closest<HTMLElement>("[data-roster]");
    if (rosterButton?.dataset.roster) {
      selected = findRosterBySlug(items, rosterButton.dataset.roster);
      window.location.hash = `desk/${selected.slug}`;
      render();
      root.querySelector<HTMLElement>(".dossier")?.focus({ preventScroll: true });
      return;
    }

    const laneButton = target.closest<HTMLElement>("[data-lane]");
    if (laneButton?.dataset.lane) {
      filters = {
        ...filters,
        lane: laneButton.dataset.lane as CatalogFilters["lane"],
        financeOnly: false,
      };
      render();
      return;
    }

    if (target.closest("[data-finance]")) {
      filters = { ...filters, lane: "all", financeOnly: !filters.financeOnly };
      render();
      return;
    }

    const copyButton = target.closest<HTMLElement>("[data-copy]");
    if (copyButton?.dataset.copy) void copyPrompt(copyButton.dataset.copy);
  };

  const onHashChange = (): void => {
    selected = findRosterBySlug(items, hashSlug());
    render();
  };

  root.addEventListener("input", onInput);
  root.addEventListener("change", onChange);
  root.addEventListener("click", onClick);
  window.addEventListener("hashchange", onHashChange);
  render();

  return () => {
    root.removeEventListener("input", onInput);
    root.removeEventListener("change", onChange);
    root.removeEventListener("click", onClick);
    window.removeEventListener("hashchange", onHashChange);
  };
}

