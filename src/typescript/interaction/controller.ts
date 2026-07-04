import type { Attr, Position, Relation, Via } from "../state/types.ts";
import type { Store } from "../store/store.ts";
import type { Handlers } from "../view/handlers.ts";
import * as A from "../actions/creators.ts";
import {
  entitiesBounds,
  entitiesInRect,
  entityAt,
  insertIndex,
  nearestEntity,
  relEndpoints,
  snap,
} from "../geometry/geometry.ts";
import { genId } from "../utils/id.ts";
import * as storage from "../persistence/storage.ts";
import { exportFilename, renderDiagramSvg } from "../export/svg-export.ts";
import { parseDiagramSvg } from "../export/svg-import.ts";

// Translates raw DOM events into dispatched actions. Transient gesture bookkeeping
// (what's being dragged, the positions a gesture started from) lives here in
// closures — never in the store's state — exactly like the prototype kept it off
// React state. Continuous gestures preview optimistically and commit a single
// self-inverse action on release, so each drag is one undo step.

interface EntityDrag {
  id: string;
  dx: number;
  dy: number;
  starts: Record<string, Position>;
  relVias: { id: string; start: Via[] }[];
  moved: boolean;
  dd: { ddx: number; ddy: number };
}

interface EdgeDrag {
  id: string;
  index: number;
  fromVias: Via[];
  toVias: Via[];
}

interface AttrDrag {
  entId: string;
  index: number;
  fromAttrs: Attr[];
  toAttrs: Attr[];
}

const CLIENT = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function createController(store: Store): Handlers {
  // --- transient gesture state ---
  let drag: EntityDrag | null = null;
  let pan: { sx: number; sy: number; px: number; py: number } | null = null;
  let resize: { sx: number; sw: number } | null = null;
  let marquee: { x0: number; y0: number } | null = null;
  let edgePending: { id: string } | null = null;
  let edgeDrag: EdgeDrag | null = null;
  let newRel: { from: string; fromAttr: number | null } | null = null;
  let attrDrag: AttrDrag | null = null;

  const canvasEl = () => document.getElementById("canvas");
  const doc = () => store.state.doc;
  const ui = () => store.state.ui;
  const entById = (id: string) => doc().entities.find((e) => e.id === id);
  const relById = (id: string) => doc().relations.find((r) => r.id === id);

  function world(e: { clientX: number; clientY: number }): Position {
    const el = canvasEl();
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    const { panX, panY, scale } = ui().viewport;
    return { x: (e.clientX - r.left - panX) / scale, y: (e.clientY - r.top - panY) / scale };
  }

  const select = (kind: "ent" | "rel", id: string, selIds: string[] = []) =>
    store.dispatchUi({ type: "SET_SELECTION", sel: { kind, id }, selIds });
  const clearSelection = () => store.dispatchUi({ type: "SET_SELECTION", sel: null, selIds: [] });

  // --- global gesture pump (window-level so drags keep working off-canvas) ---

  function onWindowMove(e: MouseEvent) {
    if (resize) {
      store.dispatchUi({ type: "SET_PANEL_WIDTH", width: CLIENT(resize.sw + (resize.sx - e.clientX), 240, 560) });
      return;
    }
    if (drag) {
      drag.moved = true;
      const w = world(e);
      const nx = snap(w.x - drag.dx);
      const ny = snap(w.y - drag.dy);
      const start = drag.starts[drag.id]!;
      const ddx = nx - start.x;
      const ddy = ny - start.y;
      drag.dd = { ddx, ddy };
      store.preview(entityMoveBatch(drag, ddx, ddy));
      return;
    }
    if (marquee) {
      const w = world(e);
      const x = Math.min(marquee.x0, w.x);
      const y = Math.min(marquee.y0, w.y);
      const ww = Math.abs(w.x - marquee.x0);
      const hh = Math.abs(w.y - marquee.y0);
      const ids = entitiesInRect(doc().entities, x, y, ww, hh);
      store.dispatchUi({ type: "SET_MARQUEE", marquee: { x, y, w: ww, h: hh } });
      store.dispatchUi({
        type: "SET_SELECTION",
        sel: ids.length ? { kind: "ent", id: ids[ids.length - 1]! } : null,
        selIds: ids,
      });
      return;
    }
    if (edgePending) {
      // First real drag after grabbing a line body: insert a waypoint, then drag it.
      const id = edgePending.id;
      edgePending = null;
      const rel = relById(id);
      if (!rel) return;
      const from = (rel.vias || []).map((v) => ({ ...v }));
      const w = world(e);
      const { p1, p2 } = endpoints(rel);
      const idx = insertIndex(p1, p2, from, w);
      const to = from.slice();
      to.splice(idx, 0, { x: Math.round(w.x), y: Math.round(w.y) });
      edgeDrag = { id, index: idx, fromVias: from, toVias: to };
      store.preview(A.setVias(id, from, to));
      return;
    }
    if (edgeDrag) {
      const w = world(e);
      const rel = relById(edgeDrag.id);
      if (!rel) return;
      const to = (rel.vias || []).slice();
      to[edgeDrag.index] = { x: Math.round(w.x), y: Math.round(w.y) };
      edgeDrag.toVias = to;
      store.preview(A.setVias(edgeDrag.id, edgeDrag.fromVias, to));
      return;
    }
    if (newRel) {
      const w = world(e);
      const target = entityAt(doc().entities, w, newRel.from);
      store.dispatchUi({
        type: "SET_NEW_REL",
        newRel: { from: newRel.from, fromAttr: newRel.fromAttr, x: w.x, y: w.y },
        newRelTarget: target,
      });
      return;
    }
    if (pan) {
      store.dispatchUi({
        type: "SET_VIEWPORT",
        scale: ui().viewport.scale,
        panX: pan.px + (e.clientX - pan.sx),
        panY: pan.py + (e.clientY - pan.sy),
      });
      return;
    }
    detectNear(e);
  }

  function onWindowUp(e: MouseEvent) {
    if (drag) {
      if (drag.moved) commitEntityDrag(drag);
      drag = null;
    }
    if (edgeDrag) {
      if (!sameVias(edgeDrag.fromVias, edgeDrag.toVias)) {
        store.dispatch(A.setVias(edgeDrag.id, edgeDrag.fromVias, edgeDrag.toVias));
      }
      edgeDrag = null;
    }
    edgePending = null;
    if (newRel) {
      const target = entityAt(doc().entities, world(e), newRel.from);
      const from = newRel.from;
      const fromAttr = newRel.fromAttr;
      newRel = null;
      if (target) {
        const rid = genId("r");
        const relation: Relation = { id: rid, from, to: target, fromCard: "1", toCard: "N" };
        if (fromAttr != null) relation.fromAttr = fromAttr;
        store.dispatch(A.addRelation(relation));
        select("rel", rid);
      }
      store.dispatchUi({ type: "SET_NEW_REL", newRel: null, newRelTarget: null });
      store.dispatchUi({ type: "SET_NEAR", nearId: null });
    }
    pan = null;
    resize = null;
    if (marquee) {
      marquee = null;
      store.dispatchUi({ type: "SET_MARQUEE", marquee: null });
    }
    if (attrDrag) {
      if (!sameAttrs(attrDrag.fromAttrs, attrDrag.toAttrs)) {
        store.dispatch(A.setEntityAttrs(attrDrag.entId, attrDrag.fromAttrs, attrDrag.toAttrs));
      }
      attrDrag = null;
      store.dispatchUi({ type: "SET_DRAG_ATTR", index: -1 });
    }
  }

  function onKey(e: KeyboardEvent) {
    if (ui().dialog) {
      if (e.key === "Escape") store.dispatchUi({ type: "CLOSE_DIALOG" });
      return;
    }
    const t = (e.target as HTMLElement).tagName;
    if (t === "INPUT" || t === "SELECT" || t === "TEXTAREA") return;
    const meta = e.metaKey || e.ctrlKey;
    if (meta && !e.altKey && e.key.toLowerCase() === "z") {
      e.preventDefault();
      if (e.shiftKey) handlers.redo();
      else handlers.undo();
      return;
    }
    if (meta && !e.altKey && e.key.toLowerCase() === "y") {
      e.preventDefault();
      handlers.redo();
      return;
    }
    if ((e.key === "Delete" || e.key === "Backspace") && (ui().selIds.length || ui().sel)) {
      e.preventDefault();
      handlers.deleteSelected();
    }
  }

  // --- drag-and-drop import (whole window, so there's no dead zone) ---

  let dragCounter = 0;

  function hasFiles(e: DragEvent): boolean {
    return !!e.dataTransfer && Array.from(e.dataTransfer.types).includes("Files");
  }

  function onWindowDragEnter(e: DragEvent) {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragCounter++;
    if (dragCounter === 1) store.dispatchUi({ type: "SET_DRAG_ACTIVE", active: true });
  }
  function onWindowDragOver(e: DragEvent) {
    if (!hasFiles(e)) return;
    e.preventDefault(); // required to allow a drop
  }
  function onWindowDragLeave(e: DragEvent) {
    if (!hasFiles(e)) return;
    dragCounter = Math.max(0, dragCounter - 1);
    if (dragCounter === 0) store.dispatchUi({ type: "SET_DRAG_ACTIVE", active: false });
  }
  function onWindowDrop(e: DragEvent) {
    e.preventDefault();
    dragCounter = 0;
    store.dispatchUi({ type: "SET_DRAG_ACTIVE", active: false });
    const files = Array.from(e.dataTransfer?.files ?? []);
    const svgFile = files.find((f) => f.name.toLowerCase().endsWith(".svg") || f.type === "image/svg+xml");
    if (!svgFile) {
      if (files.length) {
        store.dispatchUi({ type: "OPEN_ERROR_DIALOG", message: "Drop a single .svg file exported from EnReD to import it." });
      }
      return;
    }
    void doImport(svgFile);
  }

  window.addEventListener("mousemove", onWindowMove);
  window.addEventListener("mouseup", onWindowUp);
  window.addEventListener("keydown", onKey);
  window.addEventListener("dragenter", onWindowDragEnter);
  window.addEventListener("dragover", onWindowDragOver);
  window.addEventListener("dragleave", onWindowDragLeave);
  window.addEventListener("drop", onWindowDrop);

  // --- helpers ---

  function downloadText(filename: string, content: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function doImport(file: File) {
    const text = await file.text();
    const result = parseDiagramSvg(text);
    if (!result.ok) {
      store.dispatchUi({ type: "OPEN_ERROR_DIALOG", message: result.error });
      return;
    }
    store.dispatch(A.replaceDoc(doc(), result.doc));
    clearSelection();
    handlers.fitToScreen();
  }

  function endpoints(rel: Relation): { p1: Position; p2: Position } {
    const a = entById(rel.from)!;
    const b = entById(rel.to)!;
    return relEndpoints(a, b, rel);
  }

  function entityMoveBatch(d: EntityDrag, ddx: number, ddy: number) {
    const actions = [];
    for (const id of Object.keys(d.starts)) {
      const s = d.starts[id]!;
      actions.push(A.moveEntity(id, s, { x: s.x + ddx, y: s.y + ddy }));
    }
    for (const rv of d.relVias) {
      actions.push(A.setVias(rv.id, rv.start, rv.start.map((v) => ({ x: v.x + ddx, y: v.y + ddy }))));
    }
    return A.batch(actions);
  }

  function commitEntityDrag(d: EntityDrag) {
    const { ddx, ddy } = d.dd;
    if (ddx === 0 && ddy === 0) return;
    store.dispatch(entityMoveBatch(d, ddx, ddy));
  }

  function detectNear(e: MouseEvent) {
    if (drag || pan || edgeDrag || edgePending || marquee || newRel) return;
    if (ui().connecting) {
      if (ui().nearId) store.dispatchUi({ type: "SET_NEAR", nearId: null });
      return;
    }
    const el = canvasEl();
    if (!el) return;
    const r = el.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) {
      if (ui().nearId) store.dispatchUi({ type: "SET_NEAR", nearId: null });
      return;
    }
    const near = nearestEntity(doc().entities, world(e));
    if (near !== ui().nearId) store.dispatchUi({ type: "SET_NEAR", nearId: near });
  }

  function newRelation(from: string, to: string): Relation {
    return { id: genId("r"), from, to, fromCard: "1", toCard: "N" };
  }

  function zoomAt(factor: number) {
    const el = canvasEl();
    if (!el) return;
    const r = el.getBoundingClientRect();
    zoomAround(r.width / 2, r.height / 2, factor);
  }

  function zoomAround(cx: number, cy: number, factor: number) {
    const { scale, panX, panY } = ui().viewport;
    const ns = CLIENT(scale * factor, 0.4, 2.5);
    const wx = (cx - panX) / scale;
    const wy = (cy - panY) / scale;
    store.dispatchUi({ type: "SET_VIEWPORT", scale: ns, panX: cx - wx * ns, panY: cy - wy * ns });
  }

  // Attr array edits: replace whole array, self-inverse via before/after.
  function commitAttrs(mut: (attrs: Attr[]) => Attr[]) {
    const id = ui().sel?.id;
    if (!id) return;
    const en = entById(id);
    if (!en) return;
    const from = en.attrs.map((a) => ({ ...a }));
    const to = mut(en.attrs.map((a) => ({ ...a })));
    store.dispatch(A.setEntityAttrs(id, from, to));
  }

  // --- public handler surface ---

  const handlers: Handlers = {
    addEntity() {
      const el = canvasEl();
      if (!el) return;
      const r = el.getBoundingClientRect();
      const { panX, panY, scale } = ui().viewport;
      const x = snap((r.width / 2 - panX) / scale - 110);
      const y = snap((r.height / 2 - panY) / scale - 60);
      const id = genId("e");
      store.dispatch(A.addEntity({ id, name: "NewEntity", color: "#6B7280", x, y, attrs: [{ name: "id", type: "uuid" }] }));
      select("ent", id, [id]);
    },
    toggleConnect() {
      store.dispatchUi({ type: "SET_CONNECT", connecting: !ui().connecting, connectFrom: null });
    },
    undo() {
      store.undo();
      clearSelection();
    },
    redo() {
      store.redo();
      clearSelection();
    },
    zoomIn() {
      zoomAt(1.15);
    },
    zoomOut() {
      zoomAt(1 / 1.15);
    },
    zoomReset() {
      store.dispatchUi({ type: "SET_VIEWPORT", scale: 1, panX: 30, panY: 24 });
    },
    fitToScreen() {
      const el = canvasEl();
      if (!el) return;
      const box = entitiesBounds(doc().entities);
      if (!box) {
        store.dispatchUi({ type: "SET_VIEWPORT", scale: 1, panX: 30, panY: 24 });
        return;
      }
      const r = el.getBoundingClientRect();
      const pad = 60;
      const scale = CLIENT(Math.min((r.width - 2 * pad) / box.w, (r.height - 2 * pad) / box.h), 0.4, 2.5);
      const panX = (r.width - box.w * scale) / 2 - box.x * scale;
      const panY = (r.height - box.h * scale) / 2 - box.y * scale;
      store.dispatchUi({ type: "SET_VIEWPORT", scale, panX, panY });
    },
    toggleTheme() {
      const next = ui().theme === "dark" ? "light" : "dark";
      store.dispatchUi({ type: "SET_THEME", theme: next });
      storage.saveThemePreference(next);
    },

    saveDiagram() {
      storage.saveDiagram(doc().title, doc());
    },
    openLoadDialog() {
      store.dispatchUi({ type: "OPEN_LOAD_DIALOG", items: storage.listSaved() });
    },
    loadSaved(id) {
      const loaded = storage.loadDiagram(id);
      store.dispatchUi({ type: "CLOSE_DIALOG" });
      if (!loaded) return;
      store.dispatch(A.replaceDoc(doc(), loaded));
      clearSelection();
      handlers.fitToScreen();
    },
    deleteSaved(id) {
      storage.deleteDiagram(id);
      store.dispatchUi({ type: "OPEN_LOAD_DIALOG", items: storage.listSaved() });
    },
    closeDialog() {
      store.dispatchUi({ type: "CLOSE_DIALOG" });
    },

    exportDiagram() {
      const svg = renderDiagramSvg(doc(), store.state.config);
      downloadText(exportFilename(doc()), svg, "image/svg+xml;charset=utf-8");
    },
    openImportPicker() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".svg,image/svg+xml";
      input.addEventListener("change", () => {
        const file = input.files?.[0];
        if (file) void doImport(file);
      });
      input.click();
    },

    onCanvasDown(e) {
      if (ui().connecting) {
        store.dispatchUi({ type: "SET_CONNECT", connecting: false, connectFrom: null });
        return;
      }
      if (e.shiftKey) {
        const w = world(e);
        marquee = { x0: w.x, y0: w.y };
        store.dispatchUi({ type: "SET_MARQUEE", marquee: { x: w.x, y: w.y, w: 0, h: 0 } });
        clearSelection();
        return;
      }
      pan = { sx: e.clientX, sy: e.clientY, px: ui().viewport.panX, py: ui().viewport.panY };
      clearSelection();
    },
    onCanvasDblClick(e) {
      if ((e.target as Element).closest?.(".node")) return;
      const w = world(e);
      const id = genId("e");
      store.dispatch(
        A.addEntity({ id, name: "NewEntity", color: "#6B7280", x: snap(w.x - 110), y: snap(w.y - 25), attrs: [{ name: "id", type: "uuid" }] }),
      );
      select("ent", id, [id]);
    },
    onCanvasMove(e) {
      detectNear(e);
    },
    onCanvasLeave() {
      if (ui().nearId && !newRel) store.dispatchUi({ type: "SET_NEAR", nearId: null });
    },
    onWheel(e) {
      e.preventDefault();
      const el = canvasEl();
      if (!el) return;
      const r = el.getBoundingClientRect();
      zoomAround(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.08 : 0.93);
    },

    onEntityDown(e, id) {
      e.stopPropagation();
      if (ui().connecting) {
        const cf = ui().connectFrom;
        if (!cf) {
          store.dispatchUi({ type: "SET_CONNECT", connecting: true, connectFrom: id });
        } else if (cf !== id) {
          const rel = newRelation(cf, id);
          store.dispatch(A.addRelation(rel));
          store.dispatchUi({ type: "SET_CONNECT", connecting: false, connectFrom: null });
          select("rel", rel.id);
        }
        return;
      }
      const w = world(e);
      const additive = e.shiftKey || e.metaKey || e.ctrlKey;
      if (additive) {
        const cur = ui().selIds.slice();
        const i = cur.indexOf(id);
        if (i >= 0) cur.splice(i, 1);
        else cur.push(id);
        store.dispatchUi({
          type: "SET_SELECTION",
          sel: cur.length ? { kind: "ent", id: cur[cur.length - 1]! } : null,
          selIds: cur,
        });
        return;
      }
      const selIds = ui().selIds.includes(id) && ui().selIds.length > 1 ? ui().selIds.slice() : [id];
      const starts: Record<string, Position> = {};
      for (const sid of selIds) {
        const en = entById(sid);
        if (en) starts[sid] = { x: en.x, y: en.y };
      }
      const movingSet = new Set(selIds);
      const relVias = doc()
        .relations.filter((r) => movingSet.has(r.from) && movingSet.has(r.to) && r.vias && r.vias.length)
        .map((r) => ({ id: r.id, start: (r.vias || []).map((v) => ({ ...v })) }));
      const en = entById(id)!;
      drag = { id, dx: w.x - en.x, dy: w.y - en.y, starts, relVias, moved: false, dd: { ddx: 0, ddy: 0 } };
      select("ent", id, selIds);
    },
    onEdgeDown(e, relId) {
      e.stopPropagation();
      select("rel", relId);
      edgePending = { id: relId };
    },
    onEdgeRemoveVias(e, relId) {
      e.stopPropagation();
      const rel = relById(relId);
      if (!rel || !rel.vias || !rel.vias.length) return;
      const from = rel.vias.map((v) => ({ ...v }));
      store.dispatch(A.setVias(relId, from, []));
    },
    onRelSelect(e, relId) {
      e.stopPropagation();
      select("rel", relId);
    },
    onHandleDown(e, relId, index) {
      e.stopPropagation();
      select("rel", relId);
      const rel = relById(relId);
      edgeDrag = {
        id: relId,
        index,
        fromVias: (rel?.vias || []).map((v) => ({ ...v })),
        toVias: (rel?.vias || []).map((v) => ({ ...v })),
      };
    },
    onHandleRemove(e, relId, index) {
      e.stopPropagation();
      const rel = relById(relId);
      if (!rel) return;
      const from = (rel.vias || []).map((v) => ({ ...v }));
      const to = from.filter((_v, i) => i !== index);
      store.dispatch(A.setVias(relId, from, to));
    },
    onOutHandleDown(e, id, attr) {
      e.stopPropagation();
      const w = world(e);
      newRel = { from: id, fromAttr: attr };
      store.dispatchUi({ type: "SET_NEW_REL", newRel: { from: id, fromAttr: attr, x: w.x, y: w.y }, newRelTarget: null });
    },
    onPanelResizeDown(e) {
      e.preventDefault();
      e.stopPropagation();
      resize = { sx: e.clientX, sw: ui().panelWidth };
    },

    onDiagramTitle(value) {
      store.dispatch(A.updateMeta({ title: value }));
    },
    onDiagramDesc(value) {
      store.dispatch(A.updateMeta({ description: value }));
    },
    onGridStyle(style) {
      store.dispatchUi({ type: "SET_GRID_STYLE", style });
    },
    onColorDesc(key, value) {
      store.dispatch(A.setColorDesc(key, doc().colorLegend[key] || "", value));
    },
    onEntityName(value) {
      const id = ui().sel?.id;
      if (id) store.dispatch(A.updateEntity(id, { name: value }));
    },
    onEntityColorSwatch(key) {
      const id = ui().sel?.id;
      if (id) store.dispatch(A.updateEntity(id, { color: key }));
    },
    onEntityColorText(value) {
      const id = ui().sel?.id;
      if (id) store.dispatch(A.updateEntity(id, { color: value }));
    },
    onRelShape(shape) {
      const id = ui().sel?.id;
      if (id) store.dispatch(A.updateRelation(id, { shape }));
    },
    onRelCard(end, value) {
      const id = ui().sel?.id;
      if (id) store.dispatch(A.updateRelation(id, end === "from" ? { fromCard: value } : { toCard: value }));
    },
    onAttrName(index, value) {
      commitAttrs((attrs) => {
        if (attrs[index]) attrs[index]!.name = value;
        return attrs;
      });
    },
    onAttrType(index, value) {
      commitAttrs((attrs) => {
        if (attrs[index]) attrs[index]!.type = value;
        return attrs;
      });
    },
    onAttrRemove(index) {
      commitAttrs((attrs) => {
        attrs.splice(index, 1);
        return attrs;
      });
    },
    onAttrAdd() {
      commitAttrs((attrs) => [...attrs, { name: "attribute", type: "string" }]);
    },
    onAttrDragStart(e, index) {
      e.preventDefault();
      const id = ui().sel?.id;
      const en = id ? entById(id) : undefined;
      if (!en) return;
      const from = en.attrs.map((a) => ({ ...a }));
      attrDrag = { entId: en.id, index, fromAttrs: from, toAttrs: from.slice() };
      store.dispatchUi({ type: "SET_DRAG_ATTR", index });
    },
    onAttrRowEnter(index) {
      if (!attrDrag || index === attrDrag.index) return;
      const en = entById(attrDrag.entId);
      if (!en) return;
      const next = en.attrs.map((a) => ({ ...a }));
      const [moved] = next.splice(attrDrag.index, 1);
      if (!moved) return;
      next.splice(index, 0, moved);
      attrDrag.index = index;
      attrDrag.toAttrs = next;
      store.preview(A.setEntityAttrs(en.id, attrDrag.fromAttrs, next));
      store.dispatchUi({ type: "SET_DRAG_ATTR", index });
    },
    onFieldFocus() {
      // No-op: each committed edit is already its own undo step.
    },
    deleteSelected() {
      const selIds = ui().selIds;
      if (selIds.length) {
        const del = new Set(selIds);
        const actions = [
          ...doc()
            .relations.filter((r) => del.has(r.from) || del.has(r.to))
            .map((r) => A.removeRelation(r.id)),
          ...selIds.map((id) => A.removeEntity(id)),
        ];
        store.dispatch(A.batch(actions));
        clearSelection();
        return;
      }
      const sel = ui().sel;
      if (!sel || sel.kind !== "rel") return;
      store.dispatch(A.removeRelation(sel.id));
      clearSelection();
    },
  };

  return handlers;
}

function sameVias(a: Via[], b: Via[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v.x === b[i]!.x && v.y === b[i]!.y);
}

function sameAttrs(a: Attr[], b: Attr[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((x, i) => x.name === b[i]!.name && x.type === b[i]!.type);
}
