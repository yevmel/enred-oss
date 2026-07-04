import type { Doc, Entity, Relation, State } from "../state/types.ts";
import type { Action, DocAction } from "../actions/types.ts";

// The reducer is a pure `(state, action) => state`. It never mutates its input
// and never performs I/O. The same reducer runs for every action regardless of
// origin — history and networking are the store's concern, not the reducer's.

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    // --- Document actions ---------------------------------------------------
    case "ADD_ENTITY":
    case "REMOVE_ENTITY":
    case "MOVE_ENTITY":
    case "UPDATE_ENTITY":
    case "SET_ENTITY_ATTRS":
    case "ADD_RELATION":
    case "REMOVE_RELATION":
    case "UPDATE_RELATION":
    case "SET_VIAS":
    case "UPDATE_META":
    case "SET_COLOR_DESC":
    case "REPLACE_DOC":
    case "BATCH":
      return { ...state, doc: docReducer(state.doc, action) };

    // --- UI actions ---------------------------------------------------------
    case "SET_SELECTION":
      return { ...state, ui: { ...state.ui, sel: action.sel, selIds: action.selIds } };
    case "SET_VIEWPORT":
      return {
        ...state,
        ui: { ...state.ui, viewport: { scale: action.scale, panX: action.panX, panY: action.panY } },
      };
    case "SET_PANEL_WIDTH":
      return { ...state, ui: { ...state.ui, panelWidth: action.width } };
    case "SET_CONNECT":
      return { ...state, ui: { ...state.ui, connecting: action.connecting, connectFrom: action.connectFrom } };
    case "SET_MARQUEE":
      return { ...state, ui: { ...state.ui, marquee: action.marquee } };
    case "SET_NEAR":
      return { ...state, ui: { ...state.ui, nearId: action.nearId } };
    case "SET_NEW_REL":
      return { ...state, ui: { ...state.ui, newRel: action.newRel, newRelTarget: action.newRelTarget } };
    case "SET_DRAG_ATTR":
      return { ...state, ui: { ...state.ui, dragAttrIndex: action.index } };
    case "OPEN_LOAD_DIALOG":
      return { ...state, ui: { ...state.ui, dialog: { kind: "load", items: action.items } } };
    case "OPEN_ERROR_DIALOG":
      return { ...state, ui: { ...state.ui, dialog: { kind: "error", message: action.message } } };
    case "CLOSE_DIALOG":
      return { ...state, ui: { ...state.ui, dialog: null } };
    case "SET_DRAG_ACTIVE":
      return { ...state, ui: { ...state.ui, dragActive: action.active } };
    case "SET_GRID_STYLE":
      return { ...state, ui: { ...state.ui, gridStyle: action.style } };
    case "SET_THEME":
      return { ...state, ui: { ...state.ui, theme: action.theme } };
    default:
      return assertNever(action);
  }
}

/** Applies a single doc action to the doc slice. Exported so `invert` can fold BATCHes. */
export function docReducer(doc: Doc, action: DocAction): Doc {
  switch (action.type) {
    case "ADD_ENTITY":
      return { ...doc, entities: insertAt(doc.entities, action.entity, action.index) };
    case "REMOVE_ENTITY":
      return { ...doc, entities: doc.entities.filter((e) => e.id !== action.id) };
    case "MOVE_ENTITY":
      return {
        ...doc,
        entities: mapEntity(doc.entities, action.id, (e) => ({ ...e, x: action.to.x, y: action.to.y })),
      };
    case "UPDATE_ENTITY":
      return { ...doc, entities: mapEntity(doc.entities, action.id, (e) => ({ ...e, ...action.patch })) };
    case "SET_ENTITY_ATTRS":
      return { ...doc, entities: mapEntity(doc.entities, action.id, (e) => ({ ...e, attrs: action.to })) };
    case "ADD_RELATION":
      return { ...doc, relations: insertAt(doc.relations, action.relation, action.index) };
    case "REMOVE_RELATION":
      return { ...doc, relations: doc.relations.filter((r) => r.id !== action.id) };
    case "UPDATE_RELATION":
      return { ...doc, relations: mapRelation(doc.relations, action.id, (r) => ({ ...r, ...action.patch })) };
    case "SET_VIAS":
      return {
        ...doc,
        relations: mapRelation(doc.relations, action.id, (r) => withVias(r, action.to)),
      };
    case "UPDATE_META":
      return { ...doc, ...action.patch };
    case "SET_COLOR_DESC":
      return { ...doc, colorLegend: withColorDesc(doc.colorLegend, action.key, action.to) };
    case "REPLACE_DOC":
      return action.to;
    case "BATCH":
      return action.actions.reduce(docReducer, doc);
    default:
      return assertNever(action);
  }
}

function insertAt<T>(list: T[], item: T, index?: number): T[] {
  if (index == null || index >= list.length) return [...list, item];
  const next = list.slice();
  next.splice(index, 0, item);
  return next;
}

// Normalise "empty" values back to their absent form so undo restores the exact
// original doc: no `vias` key rather than `vias: []`, no legend entry rather
// than an empty string.
function withVias(r: Relation, vias: Relation["vias"]): Relation {
  if (!vias || vias.length === 0) {
    const { vias: _drop, ...rest } = r;
    return rest;
  }
  return { ...r, vias };
}

function withColorDesc(legend: Doc["colorLegend"], key: string, value: string): Doc["colorLegend"] {
  if (value === "") {
    const { [key]: _drop, ...rest } = legend;
    return rest;
  }
  return { ...legend, [key]: value };
}

function mapEntity(entities: Entity[], id: string, fn: (e: Entity) => Entity): Entity[] {
  return entities.map((e) => (e.id === id ? fn(e) : e));
}

function mapRelation(relations: Relation[], id: string, fn: (r: Relation) => Relation): Relation[] {
  return relations.map((r) => (r.id === id ? fn(r) : r));
}

function assertNever(x: never): never {
  throw new Error("reducer: unhandled action " + JSON.stringify(x));
}
