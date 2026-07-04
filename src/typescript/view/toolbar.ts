import { html, type TemplateResult } from "lit-html";
import type { ViewModel } from "./derive.ts";
import type { Handlers } from "./handlers.ts";
import { getToolbarItems, type ToolbarContext } from "./toolbar-registry.ts";

// The top control bar. Deliberately generic: it knows nothing about Entity,
// Relation, Undo, Save, or any other specific button — it only renders
// whatever's registered via `toolbar-registry.ts`, in `order`. EnReD's own
// buttons (toolbar-builtins.ts) are registered the same way a closed-source
// extension's buttons would be, so adding, removing, or reordering a button
// never means editing this file.

export function toolbar(ctx: ToolbarContext): TemplateResult {
  return html`
    <div style="height:62px;flex:none;display:flex;align-items:center;gap:10px;padding:0 16px;">
      ${getToolbarItems().map((item) => item.render(ctx))}
    </div>
  `;
}

export function toolbarContext(vm: ViewModel, h: Handlers, canUndo: boolean, canRedo: boolean): ToolbarContext {
  return { accent: vm.accent, connecting: vm.connecting, zoomPct: vm.zoomPct, canUndo, canRedo, theme: vm.theme.mode, h };
}
