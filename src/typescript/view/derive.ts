import type { Attr, Entity, GridStyle, Relation, State, Via } from "../state/types.ts";
import {
  ATTR_ROW_H,
  ATTR_ROW_OFFSET,
  ENTITY_W,
  HEADER_H,
  REL_GAP,
  along,
  edgePath,
  sourceY,
} from "../geometry/geometry.ts";
import { DEFAULT_ENTITY_COLOR, SWATCHES, tintOf } from "../utils/colors.ts";
import { getTheme, type Theme } from "../theme/tokens.ts";

// Pure `state -> view model`. This is the port of the prototype's renderVals()
// minus the event handlers: it turns raw diagram + ui state into the flat,
// render-ready numbers and strings the lit-html components consume. No DOM, no
// side effects — trivially unit-testable.

export interface EntityVM {
  id: string;
  name: string;
  x: number;
  y: number;
  tint: string;
  dot: string;
  borderColor: string;
  shadow: string;
  /** Selected entities stack above unselected ones so they stay visible when dragged over another card. */
  zIndex: number;
  attrs: { name: string; type: string; showType: boolean }[];
}

export interface EdgeVM {
  id: string;
  d: string;
  stroke: string;
  w: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dotFill: string;
}

export interface LabelVM {
  id: string;
  relId: string;
  x: number;
  y: number;
  text: string;
  color: string;
  border: string;
}

export interface HandleVM {
  relId: string;
  index: number;
  x: number;
  y: number;
  fill: string;
  stroke: string;
}

export interface OutHandleVM {
  id: string;
  attr: string;
  x: number;
  y: number;
}

export interface PanelVM {
  section: "empty" | "entity" | "relation" | "multi";
  // diagram (empty)
  title: string;
  description: string;
  colors: { key: string; hex: string; desc: string }[];
  hasColors: boolean;
  gridStyle: GridStyle;
  // multi
  multiCount: number;
  // entity
  entName: string;
  entColor: string;
  swatches: { key: string; hex: string; selected: boolean }[];
  attrs: { index: number; name: string; type: string; dragging: boolean }[];
  // relation
  relFromName: string;
  relToName: string;
  relFromCard: string;
  relToCard: string;
  relShape: "s-curve" | "straight";
  shapeLocked: boolean;
}

export interface ViewModel {
  accent: string;
  theme: Theme;
  gridFill: string;
  panX: number;
  panY: number;
  scale: number;
  zoomPct: string;
  entities: EntityVM[];
  edges: EdgeVM[];
  labels: LabelVM[];
  handles: HandleVM[];
  outHandles: OutHandleVM[];
  newRelPath: string;
  marquee: State["ui"]["marquee"];
  connecting: boolean;
  bannerText: string;
  canvasCursor: string;
  entCursor: string;
  panelWidth: number;
  panel: PanelVM;
}

const GRID_FILL: Record<GridStyle, string> = {
  cross: "url(#gcross)",
  dots: "url(#gdots)",
  none: "none",
};

export function derive(state: State): ViewModel {
  const { doc, ui, config } = state;
  const accent = config.accent;
  const theme = getTheme(ui.theme);
  const em = new Map<string, Entity>();
  for (const e of doc.entities) em.set(e.id, e);

  const entities: EntityVM[] = doc.entities.map((en) => {
    const col = en.color || DEFAULT_ENTITY_COLOR;
    const isSel = ui.selIds.includes(en.id);
    const isFrom = ui.connectFrom === en.id;
    const isTarget = ui.newRelTarget === en.id;
    const highlighted = isSel || isFrom || isTarget;
    return {
      id: en.id,
      name: en.name,
      x: en.x,
      y: en.y,
      tint: tintOf(col, theme.surface, theme.entityTintRatio),
      dot: col,
      borderColor: highlighted ? accent : theme.entityBorder,
      shadow:
        isSel || isTarget
          ? `0 0 0 3px ${accent}33, 0 8px 24px rgba(${theme.shadowRgb},0.10)`
          : `0 1px 3px rgba(${theme.shadowRgb},0.06)`,
      zIndex: isSel ? 1 : 0,
      attrs: en.attrs.map((a) => ({ name: a.name, type: a.type, showType: config.showTypes })),
    };
  });

  const edges: EdgeVM[] = [];
  const labels: LabelVM[] = [];
  const handles: HandleVM[] = [];
  const sel = ui.sel;

  for (const r of doc.relations) {
    const a = em.get(r.from);
    const b = em.get(r.to);
    if (!a || !b) continue;
    const p1 = { x: a.x + ENTITY_W + REL_GAP, y: sourceY(a, r.fromAttr) };
    const p2 = { x: b.x - REL_GAP, y: b.y + HEADER_H / 2 };
    const isSel = !!sel && sel.kind === "rel" && sel.id === r.id;
    const stroke = isSel ? accent : theme.edgeStroke;
    const vias: Via[] = r.vias || [];
    const pts = [p1, ...vias, p2];
    const d = edgePath(p1, p2, vias, (r.shape || "s-curve") === "straight");

    if (vias.length) {
      vias.forEach((v, i) =>
        handles.push({
          relId: r.id,
          index: i,
          x: v.x,
          y: v.y,
          fill: isSel ? accent : theme.surface,
          stroke: isSel ? accent : theme.edgeStroke,
        }),
      );
    }

    edges.push({
      id: r.id,
      d,
      stroke,
      w: isSel ? 2 : 1.5,
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      dotFill: isSel ? accent : theme.surface,
    });

    const la = along(p1, pts[1]!, 34);
    const lb = along(p2, pts[pts.length - 2]!, 34);
    const color = isSel ? accent : theme.textSecondary;
    const border = isSel ? accent : theme.entityBorder;
    if (r.fromCard && r.fromCard.trim())
      labels.push({ id: r.id + "a", relId: r.id, x: la.x, y: la.y - 14, text: r.fromCard, color, border });
    if (r.toCard && r.toCard.trim())
      labels.push({ id: r.id + "b", relId: r.id, x: lb.x, y: lb.y - 14, text: r.toCard, color, border });
  }

  // Out-handles: shown when the cursor is near an entity (and not mid-gesture).
  const outHandles: OutHandleVM[] = [];
  const src = ui.nearId ? em.get(ui.nearId) : null;
  if (src && !ui.connecting && !ui.newRel) {
    outHandles.push({ id: src.id, attr: "", x: src.x + ENTITY_W + REL_GAP, y: src.y + HEADER_H / 2 });
    src.attrs.forEach((_a, i) =>
      outHandles.push({
        id: src.id,
        attr: String(i),
        x: src.x + ENTITY_W + REL_GAP,
        y: src.y + ATTR_ROW_OFFSET + i * ATTR_ROW_H,
      }),
    );
  }

  let newRelPath = "";
  if (ui.newRel) {
    const s = em.get(ui.newRel.from);
    if (s) {
      const sy = sourceY(s, ui.newRel.fromAttr);
      const p1 = { x: s.x + ENTITY_W + REL_GAP, y: sy };
      const t = { x: ui.newRel.x, y: ui.newRel.y };
      const k = Math.max(40, Math.abs(t.x - p1.x) * 0.5);
      newRelPath = `M ${p1.x} ${p1.y} C ${p1.x + k} ${p1.y}, ${t.x - k} ${t.y}, ${t.x} ${t.y}`;
    }
  }

  return {
    accent,
    theme,
    gridFill: GRID_FILL[ui.gridStyle],
    panX: ui.viewport.panX,
    panY: ui.viewport.panY,
    scale: ui.viewport.scale,
    zoomPct: Math.round(ui.viewport.scale * 100) + "%",
    entities,
    edges,
    labels,
    handles,
    outHandles,
    newRelPath,
    marquee: ui.marquee,
    connecting: ui.connecting,
    bannerText: ui.connectFrom ? "Now click the target entity" : "Click the source entity",
    canvasCursor: ui.connecting ? "crosshair" : "default",
    entCursor: ui.connecting ? "crosshair" : "grab",
    panelWidth: ui.panelWidth,
    panel: derivePanel(state, em),
  };
}

function derivePanel(state: State, em: Map<string, Entity>): PanelVM {
  const { doc, ui, config } = state;
  const accent = config.accent;
  const multiSel = ui.selIds.length > 1;
  const sel = ui.sel;
  const selEnt: Entity | null = !multiSel && sel && sel.kind === "ent" ? em.get(sel.id) ?? null : null;
  const selRel: Relation | null =
    ui.selIds.length === 0 && sel && sel.kind === "rel" ? doc.relations.find((r) => r.id === sel.id) ?? null : null;

  const section: PanelVM["section"] = multiSel ? "multi" : selEnt ? "entity" : selRel ? "relation" : "empty";

  // Colours-used legend (unique, in first-seen order).
  const seen: string[] = [];
  for (const en of doc.entities) {
    const c = en.color || DEFAULT_ENTITY_COLOR;
    if (!seen.includes(c)) seen.push(c);
  }
  const colors = seen.map((c) => ({ key: c, hex: c, desc: doc.colorLegend[c] || "" }));

  const relFrom = selRel ? em.get(selRel.from) : undefined;
  const relTo = selRel ? em.get(selRel.to) : undefined;
  const fromAttrName =
    selRel && relFrom && selRel.fromAttr != null && relFrom.attrs[selRel.fromAttr]
      ? "." + relFrom.attrs[selRel.fromAttr]!.name
      : "";

  return {
    section,
    title: doc.title,
    description: doc.description,
    colors,
    hasColors: doc.entities.length > 0,
    gridStyle: ui.gridStyle,
    multiCount: ui.selIds.length,
    entName: selEnt ? selEnt.name : "",
    entColor: selEnt ? selEnt.color || "" : "",
    swatches: SWATCHES.map((hex) => ({
      key: hex,
      hex,
      selected: !!selEnt && (selEnt.color || "").toLowerCase() === hex.toLowerCase(),
    })),
    attrs: selEnt
      ? selEnt.attrs.map((a: Attr, i: number) => ({
          index: i,
          name: a.name,
          type: a.type,
          dragging: ui.dragAttrIndex === i,
        }))
      : [],
    relFromName: relFrom ? relFrom.name + fromAttrName : "",
    relToName: relTo ? relTo.name : "",
    relFromCard: selRel ? selRel.fromCard : "1",
    relToCard: selRel ? selRel.toCard : "N",
    relShape: selRel ? selRel.shape || "s-curve" : "s-curve",
    shapeLocked: !!(selRel && selRel.vias && selRel.vias.length),
    // accent is available to components via the top-level VM; kept off PanelVM.
  } satisfies PanelVM;
}
