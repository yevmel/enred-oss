import type { Doc } from "../state/types.ts";
import type { DocAction } from "../actions/types.ts";
import { docReducer } from "./reducer.ts";

// `invert` is pure. For a given doc action it returns the action that undoes it,
// reading the doc *as it was before* the action applied. It never mutates and
// never generates fresh envelopes — the inverse reuses the source `meta`, so its
// `clientId` still points at us (needed for echo dedupe when undo is networked).
//
// Some actions are self-contained (MOVE_ENTITY carries from/to) and invert
// without consulting the doc; others (REMOVE_ENTITY) can only be reversed by
// reading the pre-state.

export function invert(doc: Doc, action: DocAction): DocAction {
  const meta = action.meta;
  switch (action.type) {
    case "ADD_ENTITY":
      return { type: "REMOVE_ENTITY", meta, id: action.entity.id };
    case "REMOVE_ENTITY": {
      const index = doc.entities.findIndex((e) => e.id === action.id);
      if (index < 0) return { type: "BATCH", meta, actions: [] };
      return { type: "ADD_ENTITY", meta, entity: doc.entities[index]!, index };
    }
    case "MOVE_ENTITY":
      return { type: "MOVE_ENTITY", meta, id: action.id, from: action.to, to: action.from };
    case "UPDATE_ENTITY": {
      const e = doc.entities.find((x) => x.id === action.id);
      const patch: { name?: string; color?: string } = {};
      if (e) for (const k of Object.keys(action.patch) as (keyof typeof action.patch)[]) patch[k] = e[k];
      return { type: "UPDATE_ENTITY", meta, id: action.id, patch };
    }
    case "SET_ENTITY_ATTRS":
      return { type: "SET_ENTITY_ATTRS", meta, id: action.id, from: action.to, to: action.from };
    case "ADD_RELATION":
      return { type: "REMOVE_RELATION", meta, id: action.relation.id };
    case "REMOVE_RELATION": {
      const index = doc.relations.findIndex((r) => r.id === action.id);
      if (index < 0) return { type: "BATCH", meta, actions: [] };
      return { type: "ADD_RELATION", meta, relation: doc.relations[index]!, index };
    }
    case "UPDATE_RELATION": {
      const r = doc.relations.find((x) => x.id === action.id);
      const patch: typeof action.patch = {};
      if (r) for (const k of Object.keys(action.patch) as (keyof typeof action.patch)[]) {
        (patch as Record<string, unknown>)[k] = r[k];
      }
      return { type: "UPDATE_RELATION", meta, id: action.id, patch };
    }
    case "SET_VIAS":
      return { type: "SET_VIAS", meta, id: action.id, from: action.to, to: action.from };
    case "UPDATE_META": {
      const patch: { title?: string; description?: string } = {};
      if ("title" in action.patch) patch.title = doc.title;
      if ("description" in action.patch) patch.description = doc.description;
      return { type: "UPDATE_META", meta, patch };
    }
    case "SET_COLOR_DESC":
      return { type: "SET_COLOR_DESC", meta, key: action.key, from: action.to, to: action.from };
    case "REPLACE_DOC":
      return { type: "REPLACE_DOC", meta, from: action.to, to: action.from };
    case "BATCH": {
      // Fold the batch forward, collecting each sub-inverse against the state as
      // it was just before that sub-action, then reverse the order.
      const inverses: DocAction[] = [];
      let cur = doc;
      for (const sub of action.actions) {
        inverses.push(invert(cur, sub));
        cur = docReducer(cur, sub);
      }
      inverses.reverse();
      return { type: "BATCH", meta, actions: inverses };
    }
    default:
      return assertNever(action);
  }
}

function assertNever(x: never): never {
  throw new Error("invert: unhandled action " + JSON.stringify(x));
}
