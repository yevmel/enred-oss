import type { TemplateResult } from "lit-html";
import type { ThemeMode } from "../theme/tokens.ts";
import type { Handlers } from "./handlers.ts";

// Extensibility seam for the top bar: decouples toolbar buttons from
// `toolbar.ts` itself. Every button — including all the built-in ones in
// `toolbar-builtins.ts` — is registered here via `registerToolbarItem`.
// `toolbar.ts` only calls `getToolbarItems()` and renders whatever comes
// back, sorted by `order`. Adding, removing, or reordering a feature's
// button never requires touching `toolbar.ts`.
//
// The registration unit is one *group* (a self-contained pill, possibly
// holding a few closely related buttons — e.g. Save+Load), not a single
// `<button>`, since that's the toolbar's existing visual grouping. A
// closed-source consumer registers its own group the same way the built-ins
// do, and picks an `order` to land it wherever it belongs relative to them.

export interface ToolbarContext {
  accent: string;
  connecting: boolean;
  zoomPct: string;
  canUndo: boolean;
  canRedo: boolean;
  theme: ThemeMode;
  h: Handlers;
}

export type ToolbarAlign = "left" | "right";

export interface ToolbarItem {
  /** Unique across the whole registry; re-registering the same id replaces it. */
  id: string;
  /** Ascending sort key for left-to-right position *within its `align` side*.
   *  Built-ins use 0, 10, 20, … — leave gaps so items can be slotted in
   *  between without renumbering. */
  order: number;
  /** Which side of the toolbar this lands on. Defaults to "left". */
  align?: ToolbarAlign;
  render: (ctx: ToolbarContext) => TemplateResult;
}

const items = new Map<string, ToolbarItem>();

export function registerToolbarItem(item: ToolbarItem): void {
  items.set(item.id, item);
}

export function unregisterToolbarItem(id: string): void {
  items.delete(id);
}

/** All registered items for one side of the toolbar, sorted by `order`. */
export function getToolbarItems(align: ToolbarAlign = "left"): ToolbarItem[] {
  return [...items.values()].filter((i) => (i.align ?? "left") === align).sort((a, b) => a.order - b.order);
}
