import { html, nothing, type TemplateResult } from "lit-html";
import type { Dialog, SavedMeta } from "../state/types.ts";
import type { Handlers } from "./handlers.ts";

// Modal overlays for loading (pick one of the saved diagrams) and surfacing
// import errors. The overlay is a pure function of `ui.dialog`; its list data
// is snapshotted into state when the dialog opens, so nothing here reads
// localStorage.

const OVERLAY =
  "position:fixed;inset:0;background:var(--overlay-backdrop);display:flex;align-items:center;justify-content:center;z-index:100;";
const CARD =
  "width:420px;max-width:calc(100vw - 32px);background:var(--surface);border-radius:14px;box-shadow:0 12px 48px rgba(var(--shadow-rgb),0.24);padding:20px;display:flex;flex-direction:column;gap:14px;box-sizing:border-box;";
const TITLE = "font-size:15px;font-weight:600;color:var(--text-primary);";
const GHOST_BTN =
  "height:36px;padding:0 16px;border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);border-radius:8px;font-size:13px;font-family:inherit;cursor:pointer;";
const PRIMARY_BTN =
  "height:36px;padding:0 18px;border:none;background:var(--accent,#2F6BDB);color:#FFFFFF;border-radius:8px;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;";

export function dialog(state: Dialog, h: Handlers): TemplateResult | typeof nothing {
  if (!state) return nothing;
  // Clicking the backdrop closes; clicks inside the card are stopped.
  return html`
    <div style=${OVERLAY} @mousedown=${() => h.closeDialog()}>
      <div style=${CARD} @mousedown=${(e: MouseEvent) => e.stopPropagation()}>
        ${state.kind === "load" ? loadDialog(state.items, h) : errorDialog(state.message, h)}
      </div>
    </div>
  `;
}

function loadDialog(items: SavedMeta[], h: Handlers): TemplateResult {
  return html`
    <div style=${TITLE}>Load diagram</div>
    ${items.length === 0
      ? html`<div style="font-size:13px;color:var(--text-muted);line-height:1.6;padding:8px 0;">
          No saved diagrams yet. Use <strong style="color:var(--text-secondary);">Save</strong> to store the current one.
        </div>`
      : html`<div style="display:flex;flex-direction:column;gap:6px;max-height:50vh;overflow-y:auto;">
          ${items.map((item) => savedRow(item, h))}
        </div>`}
    <div style="display:flex;justify-content:flex-end;gap:8px;">
      <button style=${GHOST_BTN} @click=${() => h.closeDialog()}>Close</button>
    </div>
  `;
}

function errorDialog(message: string, h: Handlers): TemplateResult {
  return html`
    <div style=${TITLE}>Import failed</div>
    <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;">${message}</div>
    <div style="display:flex;justify-content:flex-end;gap:8px;">
      <button style=${PRIMARY_BTN} @click=${() => h.closeDialog()}>OK</button>
    </div>
  `;
}

function savedRow(item: SavedMeta, h: Handlers): TemplateResult {
  return html`
    <div
      class="saved-row"
      @click=${() => h.loadSaved(item.id)}
      style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--border-subtle);border-radius:9px;cursor:pointer;"
    >
      <div style="flex:1;min-width:0;">
        <div style="font-size:13px;font-weight:600;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          ${item.name}
        </div>
        <div style="font-size:11px;color:var(--text-muted);">${formatDate(item.savedAt)}</div>
      </div>
      <button
        title="Delete"
        @click=${(e: MouseEvent) => {
          e.stopPropagation();
          h.deleteSaved(item.id);
        }}
        style="flex:none;border:none;background:transparent;color:var(--icon-muted);cursor:pointer;font-size:16px;padding:0 4px;line-height:1;"
      >
        ×
      </button>
    </div>
  `;
}

function formatDate(ts: number): string {
  try {
    return new Date(ts).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}
