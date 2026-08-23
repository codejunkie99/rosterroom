import { fireEvent, getAllByRole, getByLabelText, getByRole } from "@testing-library/dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { rosters } from "../data";
import { createApp } from "./controller";
import { renderCatalog } from "./render";

describe("renderCatalog", () => {
  it("renders the 82-desk index, disclaimer, and selected dossier", () => {
    document.body.innerHTML = renderCatalog(rosters, rosters[0]!, {
      lane: "all",
      connection: "all",
      financeOnly: false,
      query: "",
    });

    expect(document.querySelector("#hero-title span")?.textContent).toBe("82");
    expect(document.querySelector(".compat small")?.textContent).toMatch(/Unofficial community project/);
    expect(document.querySelectorAll("[data-roster]")).toHaveLength(82);
    expect(getByRole(document.body, "heading", { name: "Founder command", level: 2 })).toBeTruthy();
    expect(getByRole(document.body, "button", { name: "Copy full setup" })).toBeTruthy();
    expect(getByRole(document.body, "button", { name: "Copy first job" })).toBeTruthy();
    expect(getByRole(document.body, "button", { name: "Copy fallback" })).toBeTruthy();
  });
});

describe("createApp", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    window.location.hash = "";
  });

  it("filters the index and opens a shareable dossier", () => {
    const root = document.querySelector<HTMLElement>("#app")!;
    createApp(root, rosters, { writeText: vi.fn().mockResolvedValue(undefined) });

    const search = getByLabelText(root, "Search 82 desks");
    fireEvent.input(search, { target: { value: "hedge fund" } });
    expect(root.querySelectorAll("[data-roster]")).toHaveLength(1);
    expect(getByRole(root, "heading", { name: "Hedge fund CIO", level: 2 })).toBeTruthy();

    fireEvent.input(getByLabelText(root, "Search 82 desks"), { target: { value: "" } });
    fireEvent.click(getByRole(root, "button", { name: "Finance only" }));
    expect(root.querySelectorAll("[data-roster]")).toHaveLength(34);

    fireEvent.click(getAllByRole(root, "button", { name: /Open Quant research/ })[0]!);
    expect(window.location.hash).toBe("#desk/quant-research");
    expect(getByRole(root, "heading", { name: "Quant research", level: 2 })).toBeTruthy();
  });

  it("copies complete prompt artifacts and reports success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const root = document.querySelector<HTMLElement>("#app")!;
    createApp(root, rosters, { writeText });

    fireEvent.click(getByRole(root, "button", { name: "Copy full setup" }));
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledOnce());
    expect(writeText.mock.calls[0]?.[0]).toContain("GLOBAL APPROVAL GATE");
    expect(getByRole(root, "status").textContent).toBe("Full setup copied");
  });
});
