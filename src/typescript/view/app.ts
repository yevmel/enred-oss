import { html, type TemplateResult } from "lit-html";
import type { State } from "../state/types.ts";
import type { Handlers } from "./handlers.ts";
import { derive } from "./derive.ts";
import { toolbar, toolbarContext } from "./toolbar.ts";
import { canvas } from "./canvas.ts";
import { propsPanel } from "./props-panel.ts";
import { dialog } from "./dialog.ts";
import { themeStyleVars } from "../theme/tokens.ts";

// Root template: assembles the toolbar, canvas, resize handle, and props panel.
// `--accent` plus every theme token are published as CSS variables here so
// static stylesheet rules (input focus rings, button hovers — see index.css)
// can react to both the configured accent and the current light/dark theme.

export interface RenderExtras {
  canUndo: boolean;
  canRedo: boolean;
}

export function app(state: State, h: Handlers, extras: RenderExtras): TemplateResult {
  const vm = derive(state);
  const theme = vm.theme;
  return html`
    <div
      style="--accent:${vm.accent};${themeStyleVars(theme)};display:flex;flex-direction:column;width:100vw;height:100vh;background:var(--app-bg);font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:var(--text-primary);overflow:hidden;"
    >
      ${toolbar(toolbarContext(vm, h, extras.canUndo, extras.canRedo))}
      <div style="flex:1;display:flex;min-height:0;padding:0 12px 12px 12px;gap:12px;">
        ${canvas(vm, h)}
        <div
          @mousedown=${(e: MouseEvent) => h.onPanelResizeDown(e)}
          title="Drag to resize"
          style="width:8px;flex:none;margin:0 -6px;cursor:col-resize;display:flex;align-items:center;justify-content:center;position:relative;z-index:6;"
        >
          <div style="width:3px;height:44px;border-radius:2px;background:${theme.iconMuted};"></div>
        </div>
        ${propsPanel(vm.panel, vm.accent, vm.panelWidth, h)}
      </div>
      ${state.ui.dragActive
        ? html`<div
            style="position:fixed;inset:0;background:${vm.accent}14;border:3px dashed ${vm.accent};border-radius:16px;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:200;"
          >
            <div
              style="background:${theme.surface};color:${theme.textPrimary};font-size:15px;font-weight:600;padding:14px 22px;border-radius:12px;box-shadow:0 12px 40px rgba(${theme.shadowRgb},0.2);"
            >
              Drop SVG to import
            </div>
          </div>`
        : ""}
      ${dialog(state.ui.dialog, h)}
    </div>
  `;
}
