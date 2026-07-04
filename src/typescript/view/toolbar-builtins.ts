import { html } from "lit-html";
import { registerToolbarItem, type ToolbarContext } from "./toolbar-registry.ts";

// EnReD's own toolbar groups, registered the same way a closed-source
// extension would register its own — see toolbar-registry.ts. Importing this
// module (for its side effect) is what makes these buttons appear; the entry
// point (index.ts) does that import, not toolbar.ts.

const GROUP =
  "display:flex;align-items:center;background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;";
const DIVIDER = "width:1px;align-self:stretch;background:var(--divider);";
const BTN =
  "height:40px;padding:0 16px;border:none;background:transparent;font-size:14px;font-family:inherit;color:var(--text-primary);cursor:pointer;";

registerToolbarItem({
  id: "entity-relation",
  order: 0,
  render: (ctx: ToolbarContext) => {
    const relBg = ctx.connecting ? ctx.accent : "transparent";
    const relColor = ctx.connecting ? "#FFFFFF" : "var(--text-primary)";
    return html`
      <div style=${GROUP}>
        <button class="tb" @click=${() => ctx.h.addEntity()} style=${BTN}>+ Entity</button>
        <div style=${DIVIDER}></div>
        <button
          @click=${() => ctx.h.toggleConnect()}
          style="height:40px;padding:0 16px;border:none;background:${relBg};color:${relColor};font-size:14px;font-family:inherit;cursor:pointer;"
        >
          + Relation
        </button>
      </div>
    `;
  },
});

registerToolbarItem({
  id: "undo-redo",
  order: 10,
  render: (ctx: ToolbarContext) => html`
    <div style=${GROUP}>
      <button
        class="tb"
        title="Undo"
        @click=${() => ctx.h.undo()}
        style="height:40px;width:44px;border:none;background:transparent;font-size:16px;font-family:inherit;color:var(--text-primary);cursor:pointer;opacity:${ctx.canUndo
          ? 1
          : 0.35};"
      >
        ←
      </button>
      <div style=${DIVIDER}></div>
      <button
        class="tb"
        title="Redo"
        @click=${() => ctx.h.redo()}
        style="height:40px;width:44px;border:none;background:transparent;font-size:16px;font-family:inherit;color:var(--text-primary);cursor:pointer;opacity:${ctx.canRedo
          ? 1
          : 0.35};"
      >
        →
      </button>
    </div>
  `,
});

registerToolbarItem({
  id: "zoom",
  order: 20,
  render: (ctx: ToolbarContext) => html`
    <div style=${GROUP}>
      <button
        class="tb"
        @click=${() => ctx.h.zoomOut()}
        style="height:40px;width:40px;border:none;background:transparent;font-size:16px;font-family:inherit;color:var(--text-primary);cursor:pointer;"
      >
        −
      </button>
      <button
        class="tb"
        title="Reset zoom"
        @click=${() => ctx.h.zoomReset()}
        style="height:40px;width:56px;border:none;background:transparent;font-size:12px;font-family:inherit;color:var(--text-secondary);cursor:pointer;"
      >
        ${ctx.zoomPct}
      </button>
      <button
        class="tb"
        @click=${() => ctx.h.zoomIn()}
        style="height:40px;width:40px;border:none;background:transparent;font-size:16px;font-family:inherit;color:var(--text-primary);cursor:pointer;"
      >
        +
      </button>
      <div style=${DIVIDER}></div>
      <button
        class="tb"
        title="Fit to screen"
        @click=${() => ctx.h.fitToScreen()}
        style="height:40px;width:44px;border:none;background:transparent;font-size:15px;font-family:inherit;color:var(--text-primary);cursor:pointer;"
      >
        ⤢
      </button>
    </div>
  `,
});

registerToolbarItem({
  id: "save-load",
  order: 30,
  render: (ctx: ToolbarContext) => html`
    <div style=${GROUP}>
      <button class="tb" @click=${() => ctx.h.saveDiagram()} style=${BTN}>Save</button>
      <div style=${DIVIDER}></div>
      <button class="tb" @click=${() => ctx.h.openLoadDialog()} style=${BTN}>Load</button>
    </div>
  `,
});

registerToolbarItem({
  id: "import-export",
  order: 40,
  render: (ctx: ToolbarContext) => html`
    <div style=${GROUP}>
      <button class="tb" @click=${() => ctx.h.exportDiagram()} style=${BTN}>Export</button>
      <div style=${DIVIDER}></div>
      <button class="tb" @click=${() => ctx.h.openImportPicker()} style=${BTN}>Import</button>
    </div>
  `,
});

registerToolbarItem({
  id: "theme",
  order: 50,
  render: (ctx: ToolbarContext) => html`
    <div style=${GROUP}>
      <button
        class="tb"
        title=${ctx.theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        @click=${() => ctx.h.toggleTheme()}
        style="height:40px;width:44px;border:none;background:transparent;font-size:16px;font-family:inherit;color:var(--text-primary);cursor:pointer;"
      >
        ${ctx.theme === "dark" ? "☀︎" : "☾"}
      </button>
    </div>
  `,
});
