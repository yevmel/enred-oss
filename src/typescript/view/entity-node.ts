import { html, type TemplateResult } from "lit-html";
import type { EntityVM } from "./derive.ts";
import type { Handlers } from "./handlers.ts";

// One entity card: coloured header with a name, then its attribute rows.

export function entityNode(ent: EntityVM, entCursor: string, h: Handlers): TemplateResult {
  return html`
    <div
      class="node"
      @mousedown=${(e: MouseEvent) => h.onEntityDown(e, ent.id)}
      style="position:absolute;left:0;top:0;width:220px;transform:translate(${ent.x}px, ${ent.y}px);background:var(--surface);border:1px solid ${ent.borderColor};border-radius:10px;box-shadow:${ent.shadow};cursor:${entCursor};user-select:none;box-sizing:border-box;z-index:${ent.zIndex};"
    >
      <div
        style="height:40px;display:flex;align-items:center;gap:8px;padding:0 14px;background:${ent.tint};border-radius:9px 9px 0 0;border-bottom:1px solid var(--border-subtle);box-sizing:border-box;"
      >
        <span style="width:8px;height:8px;border-radius:50%;background:${ent.dot};flex:none;"></span>
        <span style="font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          ${ent.name}
        </span>
      </div>
      <div style="padding:4px 0;">
        ${ent.attrs.map(
          (attr) => html`
            <div
              style="height:29px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 14px;box-sizing:border-box;"
            >
              <span style="font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${attr.name}</span>
              <span
                style="font-size:11px;color:var(--text-muted);font-family:ui-monospace,Menlo,monospace;flex:none;display:${attr.showType
                  ? "inline"
                  : "none"};"
                >${attr.type}</span
              >
            </div>
          `,
        )}
      </div>
    </div>
  `;
}
