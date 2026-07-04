import { html, nothing, type TemplateResult } from "lit-html";
import type { GridStyle } from "../state/types.ts";
import type { PanelVM } from "./derive.ts";
import type { Handlers } from "./handlers.ts";

// The right sidebar. Its contents depend on the current selection: nothing
// (diagram info), a single entity, a single relation, or a multi-selection.

const LABEL = "font-size:12px;color:var(--text-secondary);";
const HEADING = "font-size:11px;letter-spacing:0.08em;color:var(--text-muted);font-weight:600;";
const INPUT =
  "width:100%;box-sizing:border-box;height:34px;padding:0 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;background:var(--surface);color:var(--text-primary);outline:none;";
const DELETE_BTN =
  "height:34px;border:1px solid var(--danger-border);background:var(--danger-bg);color:var(--danger-text);border-radius:8px;font-size:13px;font-family:inherit;cursor:pointer;margin-top:4px;";

const val = (e: Event) => (e.target as HTMLInputElement).value;

export function propsPanel(panel: PanelVM, accent: string, width: number, h: Handlers): TemplateResult {
  return html`
    <div
      style="width:${width}px;flex:none;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;overflow-y:auto;box-sizing:border-box;display:flex;flex-direction:column;gap:14px;"
    >
      ${panel.section === "empty"
        ? diagramSection(panel, accent, h)
        : panel.section === "multi"
          ? multiSection(panel, h)
          : panel.section === "entity"
            ? entitySection(panel, accent, h)
            : relationSection(panel, accent, h)}
    </div>
  `;
}

const GRID_OPTIONS: { value: GridStyle; label: string }[] = [
  { value: "cross", label: "Cross" },
  { value: "dots", label: "Dots" },
  { value: "none", label: "None" },
];

function gridToggle(current: GridStyle, h: Handlers): TemplateResult {
  const on = { bg: "var(--surface)", color: "var(--text-primary)", shadow: "0 1px 2px rgba(var(--shadow-rgb),0.12)" };
  const off = { bg: "transparent", color: "var(--text-secondary)", shadow: "none" };
  return html`
    <div style="display:flex;background:var(--toggle-track-bg);border-radius:8px;padding:3px;gap:3px;">
      ${GRID_OPTIONS.map((opt) => {
        const s = opt.value === current ? on : off;
        return html`
          <button
            @click=${() => h.onGridStyle(opt.value)}
            style="flex:1;height:30px;border:none;border-radius:6px;font-size:12px;font-family:inherit;cursor:pointer;background:${s.bg};color:${s.color};box-shadow:${s.shadow};"
          >
            ${opt.label}
          </button>
        `;
      })}
    </div>
  `;
}

function diagramSection(panel: PanelVM, accent: string, h: Handlers): TemplateResult {
  return html`
    <div style=${HEADING}>DIAGRAM</div>
    <div style="display:flex;flex-direction:column;gap:6px;">
      <label style=${LABEL}>Title</label>
      <input
        class="fld"
        .value=${panel.title}
        @change=${(e: Event) => h.onDiagramTitle(val(e))}
        placeholder="Untitled diagram"
        style=${INPUT}
      />
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;">
      <label style=${LABEL}>Description</label>
      <textarea
        class="fld"
        .value=${panel.description}
        @change=${(e: Event) => h.onDiagramDesc(val(e))}
        rows="4"
        placeholder="What does this diagram model?"
        style="width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;line-height:1.5;font-family:inherit;background:var(--surface);color:var(--text-primary);outline:none;resize:vertical;"
      ></textarea>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;">
      <label style=${LABEL}>Grid</label>
      ${gridToggle(panel.gridStyle, h)}
    </div>
    ${panel.hasColors
      ? html`
          <div style="display:flex;flex-direction:column;gap:8px;">
            <label style=${LABEL}>Colors used</label>
            <div style="display:flex;flex-direction:column;gap:6px;">
              ${panel.colors.map(
                (c) => html`
                  <div style="display:flex;align-items:center;gap:8px;">
                    <span
                      style="width:16px;height:16px;flex:none;border-radius:4px;background:${c.hex};box-shadow:inset 0 0 0 1px var(--swatch-ring);"
                    ></span>
                    <input
                      class="fld"
                      .value=${c.desc}
                      @change=${(e: Event) => h.onColorDesc(c.key, val(e))}
                      placeholder="Describe this color…"
                      style="flex:1;min-width:0;height:32px;box-sizing:border-box;padding:0 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;background:var(--surface);color:var(--text-primary);outline:none;"
                    />
                  </div>
                `,
              )}
            </div>
          </div>
        `
      : nothing}
    <div style="border-top:1px solid var(--border-subtle);padding-top:12px;font-size:12px;color:var(--text-muted);line-height:1.6;">
      Select an entity or relation on the canvas to edit it. Drag entities to move; scroll to zoom; drag the background to
      pan. Shift-click entities or shift-drag the canvas to select several at once.
    </div>
  `;
}

function multiSection(panel: PanelVM, h: Handlers): TemplateResult {
  return html`
    <div style=${HEADING}>SELECTION</div>
    <div style="font-size:15px;font-weight:600;">${panel.multiCount} entities selected</div>
    <div style="font-size:12px;color:var(--text-muted);line-height:1.6;">
      Drag any selected entity to move them together. Shift-click an entity to add or remove it from the selection.
    </div>
    <button class="danger-btn" @click=${() => h.deleteSelected()} style=${DELETE_BTN}>Delete selected</button>
  `;
}

function entitySection(panel: PanelVM, accent: string, h: Handlers): TemplateResult {
  return html`
    <div style=${HEADING}>ENTITY</div>
    <div style="display:flex;flex-direction:column;gap:6px;">
      <label style=${LABEL}>Name</label>
      <input
        class="fld"
        .value=${panel.entName}
        @change=${(e: Event) => h.onEntityName(val(e))}
        @focus=${() => h.onFieldFocus()}
        style=${INPUT}
      />
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      <label style=${LABEL}>Color</label>
      <div style="display:flex;align-items:center;gap:8px;">
        <span
          style="width:16px;height:16px;flex:none;border-radius:4px;background:${panel.entColor};box-shadow:inset 0 0 0 1px var(--swatch-ring);"
        ></span>
        <input
          class="fld"
          .value=${panel.entColor}
          @change=${(e: Event) => h.onEntityColorText(val(e))}
          @focus=${() => h.onFieldFocus()}
          placeholder="#6B7280 or any CSS color"
          style="flex:1;min-width:0;height:34px;box-sizing:border-box;padding:0 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:ui-monospace,Menlo,monospace;background:var(--surface);color:var(--text-primary);outline:none;"
        />
      </div>
      <div style="display:flex;gap:10px;">
        ${panel.swatches.map(
          (sw) => html`
            <div
              @click=${() => h.onEntityColorSwatch(sw.key)}
              style="width:20px;height:20px;border-radius:50%;background:${sw.hex};box-shadow:0 0 0 2px var(--surface), 0 0 0 3.5px ${sw.selected
                ? "var(--text-primary)"
                : "transparent"};cursor:pointer;"
            ></div>
          `,
        )}
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div style="display:flex;align-items:center;">
        <label style=${LABEL}>Attributes</label>
        <div style="flex:1;"></div>
        <button
          @click=${() => h.onAttrAdd()}
          style="border:none;background:transparent;color:${accent};font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;padding:2px 4px;"
        >
          + Add
        </button>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        ${panel.attrs.map(
          (a) => html`
            <div
              @mouseenter=${() => h.onAttrRowEnter(a.index)}
              style="display:flex;align-items:center;gap:6px;background:${a.dragging
                ? "var(--row-bg-active)"
                : "var(--row-bg)"};border-radius:8px;padding:4px;"
            >
              <div
                @mousedown=${(e: MouseEvent) => h.onAttrDragStart(e, a.index)}
                title="Drag to reorder"
                style="cursor:grab;color:var(--icon-muted);font-size:11px;padding:0 3px;user-select:none;line-height:1;"
              >
                ⣿
              </div>
              <input
                class="fld"
                .value=${a.name}
                @change=${(e: Event) => h.onAttrName(a.index, val(e))}
                @focus=${() => h.onFieldFocus()}
                style="flex:1;min-width:0;height:28px;padding:0 8px;border:1px solid var(--border);border-radius:6px;font-size:12px;font-family:inherit;background:var(--surface);color:var(--text-primary);outline:none;"
              />
              <input
                class="fld"
                .value=${a.type}
                @change=${(e: Event) => h.onAttrType(a.index, val(e))}
                @focus=${() => h.onFieldFocus()}
                placeholder="type"
                style="width:72px;flex:none;height:28px;padding:0 8px;border:1px solid var(--border);border-radius:6px;font-size:11px;font-family:ui-monospace,Menlo,monospace;background:var(--surface);color:var(--text-secondary);outline:none;"
              />
              <button
                @click=${() => h.onAttrRemove(a.index)}
                style="border:none;background:transparent;color:var(--icon-muted);cursor:pointer;font-size:14px;padding:0 4px;line-height:1;"
              >
                ×
              </button>
            </div>
          `,
        )}
      </div>
    </div>
    <button class="danger-btn" @click=${() => h.deleteSelected()} style=${DELETE_BTN}>Delete entity</button>
  `;
}

function relationSection(panel: PanelVM, accent: string, h: Handlers): TemplateResult {
  const on = { bg: "var(--surface)", color: "var(--text-primary)", shadow: "0 1px 2px rgba(var(--shadow-rgb),0.12)" };
  const off = { bg: "transparent", color: "var(--text-secondary)", shadow: "none" };
  const sc = panel.relShape === "s-curve" ? on : off;
  const st = panel.relShape === "straight" ? on : off;
  const shapeBtn = (shape: "s-curve" | "straight", label: string, s: typeof on) => html`
    <button
      @click=${() => h.onRelShape(shape)}
      style="flex:1;height:30px;border:none;border-radius:6px;font-size:12px;font-family:inherit;cursor:pointer;background:${s.bg};color:${s.color};box-shadow:${s.shadow};"
    >
      ${label}
    </button>
  `;
  return html`
    <div style=${HEADING}>RELATION</div>
    <div style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;">
      <span style="background:var(--surface-hover);border-radius:6px;padding:4px 8px;">${panel.relFromName}</span>
      <span style="color:var(--text-muted);font-weight:400;">→</span>
      <span style="background:var(--surface-hover);border-radius:6px;padding:4px 8px;">${panel.relToName}</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;">
      <label style=${LABEL}>Shape</label>
      <div
        style="display:flex;background:var(--toggle-track-bg);border-radius:8px;padding:3px;gap:3px;opacity:${panel.shapeLocked
          ? 0.45
          : 1};pointer-events:${panel.shapeLocked ? "none" : "auto"};"
      >
        ${shapeBtn("s-curve", "S-curve", sc)} ${shapeBtn("straight", "Straight", st)}
      </div>
      ${panel.shapeLocked
        ? html`<div style="font-size:11px;color:var(--text-muted);line-height:1.5;">
            Shape is driven by the curvature handles. Remove them (double-click) to switch strategy.
          </div>`
        : nothing}
    </div>
    <div style="display:flex;gap:10px;">
      <div style="flex:1;display:flex;flex-direction:column;gap:6px;min-width:0;">
        <label style="font-size:12px;color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
          >${panel.relFromName} end</label
        >
        <input
          class="fld"
          .value=${panel.relFromCard}
          @change=${(e: Event) => h.onRelCard("from", val(e))}
          @focus=${() => h.onFieldFocus()}
          placeholder="e.g. 1"
          style="height:34px;box-sizing:border-box;padding:0 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;background:var(--surface);color:var(--text-primary);outline:none;"
        />
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:6px;min-width:0;">
        <label style="font-size:12px;color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
          >${panel.relToName} end</label
        >
        <input
          class="fld"
          .value=${panel.relToCard}
          @change=${(e: Event) => h.onRelCard("to", val(e))}
          @focus=${() => h.onFieldFocus()}
          placeholder="e.g. N"
          style="height:34px;box-sizing:border-box;padding:0 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;background:var(--surface);color:var(--text-primary);outline:none;"
        />
      </div>
    </div>
    <button class="danger-btn" @click=${() => h.deleteSelected()} style=${DELETE_BTN}>Delete relation</button>
  `;
}
