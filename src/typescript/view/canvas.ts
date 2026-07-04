import { html, svg, type TemplateResult } from "lit-html";
import type { ViewModel } from "./derive.ts";
import type { Handlers } from "./handlers.ts";
import { entityNode } from "./entity-node.ts";

// The scrollable diagram surface. A single transformed layer holds the grid +
// relations (SVG) and the entity cards / labels / handles (positioned divs),
// so pan and zoom are a single CSS transform on the wrapper.

export function canvas(vm: ViewModel, h: Handlers): TemplateResult {
  return html`
    <div
      id="canvas"
      @mousedown=${(e: MouseEvent) => h.onCanvasDown(e)}
      @dblclick=${(e: MouseEvent) => h.onCanvasDblClick(e)}
      @mousemove=${(e: MouseEvent) => h.onCanvasMove(e)}
      @mouseleave=${() => h.onCanvasLeave()}
      @wheel=${(e: WheelEvent) => h.onWheel(e)}
      style="flex:1;position:relative;overflow:hidden;background:var(--canvas-bg);border:1px solid var(--border);border-radius:12px;cursor:${vm.canvasCursor};"
    >
      <div
        style="position:absolute;left:0;top:0;width:0;height:0;transform-origin:0 0;transform:translate(${vm.panX}px, ${vm.panY}px) scale(${vm.scale});"
      >
        ${svgLayer(vm, h)} ${vm.entities.map((ent) => entityNode(ent, vm.entCursor, h))}
        ${vm.labels.map(
          (lab) => html`
            <div
              class="node"
              @mousedown=${(e: MouseEvent) => h.onRelSelect(e, lab.relId)}
              style="position:absolute;left:0;top:0;transform:translate(${lab.x}px, ${lab.y}px) translate(-50%, -50%);background:var(--surface);color:${lab.color};border:1px solid ${lab.border};border-radius:999px;padding:2px 7px;font-size:11px;font-weight:500;white-space:nowrap;cursor:pointer;box-shadow:0 1px 2px rgba(var(--shadow-rgb),0.05);"
            >
              ${lab.text}
            </div>
          `,
        )}
        ${vm.marquee
          ? html`<div
              style="position:absolute;left:0;top:0;transform:translate(${vm.marquee.x}px, ${vm.marquee
                .y}px);width:${vm.marquee.w}px;height:${vm.marquee.h}px;background:${vm.accent}1A;border:1px solid ${vm.accent};border-radius:2px;pointer-events:none;"
            ></div>`
          : ""}
        ${vm.outHandles.map(
          (oh) => html`
            <div
              class="node"
              @mousedown=${(e: MouseEvent) => h.onOutHandleDown(e, oh.id, oh.attr === "" ? null : Number(oh.attr))}
              title="Drag to connect"
              style="position:absolute;left:0;top:0;transform:translate(${oh.x}px, ${oh.y}px) translate(-50%, -50%);width:14px;height:14px;border-radius:50%;background:var(--surface);border:2px solid ${vm.accent};cursor:crosshair;box-shadow:0 1px 4px rgba(var(--shadow-rgb),0.25);z-index:5;"
            ></div>
          `,
        )}
      </div>

      ${vm.connecting
        ? // Intentionally theme-invariant: a high-contrast tooltip-style chip,
          // not a themed surface, so it stays legible over either canvas bg.
          html`<div
            style="position:absolute;top:14px;left:50%;transform:translateX(-50%);background:#26262B;color:#FFFFFF;font-size:12px;padding:8px 16px;border-radius:999px;pointer-events:none;"
          >
            ${vm.bannerText}
          </div>`
        : ""}
    </div>
  `;
}

function svgLayer(vm: ViewModel, h: Handlers): TemplateResult {
  return html`
    <svg width="6000" height="4000" style="position:absolute;left:0;top:0;overflow:visible;display:block;">
      <defs>
        <pattern id="gcross" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M 14 10 V 18 M 10 14 H 18" style="stroke:var(--grid-cross);stroke-width:1;fill:none;opacity:0.5;"></path>
        </pattern>
        <pattern id="gdots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1.2" style="fill:var(--grid-dots);opacity:0.5;"></circle>
        </pattern>
      </defs>
      <rect x="-4000" y="-4000" width="14000" height="12000" style="fill:${vm.gridFill};"></rect>
      ${vm.edges.map(
        (edge) => svg`
          <g>
            <path
              class="node"
              d=${edge.d}
              @mousedown=${(e: MouseEvent) => h.onEdgeDown(e, edge.id)}
              @dblclick=${(e: MouseEvent) => h.onEdgeRemoveVias(e, edge.id)}
              style="stroke:transparent;stroke-width:16;fill:none;cursor:pointer;"
            ></path>
            <path d=${edge.d} style="stroke:${edge.stroke};stroke-width:${edge.w};fill:none;pointer-events:none;"></path>
            <circle
              cx=${edge.x1}
              cy=${edge.y1}
              r="4"
              style="fill:${edge.dotFill};stroke:${edge.stroke};stroke-width:1.5;pointer-events:none;"
            ></circle>
            <circle
              cx=${edge.x2}
              cy=${edge.y2}
              r="4"
              style="fill:${edge.dotFill};stroke:${edge.stroke};stroke-width:1.5;pointer-events:none;"
            ></circle>
          </g>
        `,
      )}
      ${vm.handles.map(
        (hd) => svg`
          <circle
            class="node"
            cx=${hd.x}
            cy=${hd.y}
            r="6"
            @mousedown=${(e: MouseEvent) => h.onHandleDown(e, hd.relId, hd.index)}
            @dblclick=${(e: MouseEvent) => h.onHandleRemove(e, hd.relId, hd.index)}
            style="fill:${hd.fill};stroke:${hd.stroke};stroke-width:2;cursor:grab;"
          ></circle>
        `,
      )}
      <path
        d=${vm.newRelPath}
        style="stroke:${vm.accent};stroke-width:2;stroke-dasharray:5 4;fill:none;pointer-events:none;"
      ></path>
    </svg>
  `;
}
