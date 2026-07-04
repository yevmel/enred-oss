import type {
  Attr,
  Dialog,
  Doc,
  Entity,
  GridStyle,
  Id,
  Marquee,
  NewRel,
  Position,
  RelShape,
  Relation,
  SavedMeta,
  Selection,
  Via,
} from "../state/types.ts";
import type { ThemeMode } from "../theme/tokens.ts";

// Actions are the wire format and the undo unit. They come in two families:
//
//   DocAction — mutate the diagram. Reversible (each has a computable inverse)
//               and networked. These are what history and the WebSocket carry.
//   UiAction  — mutate ephemeral view state. Never reversed, never sent.
//
// Both are discriminated unions keyed on `type`, so the reducer and `invert`
// can be checked for exhaustiveness at compile time.

/** Envelope metadata for networking + echo dedupe (see store/socket). */
export interface ActionMeta {
  id: string;
  clientId: string;
}

// --- Document actions (reversible + networked) ------------------------------

export type DocAction =
  // `index` is optional and only set when an inverse re-inserts a removed item
  // at its original position, so undo preserves array order.
  | { type: "ADD_ENTITY"; meta: ActionMeta; entity: Entity; index?: number }
  | { type: "REMOVE_ENTITY"; meta: ActionMeta; id: Id }
  | { type: "MOVE_ENTITY"; meta: ActionMeta; id: Id; from: Position; to: Position }
  | { type: "UPDATE_ENTITY"; meta: ActionMeta; id: Id; patch: Partial<Pick<Entity, "name" | "color">> }
  | { type: "SET_ENTITY_ATTRS"; meta: ActionMeta; id: Id; from: Attr[]; to: Attr[] }
  | { type: "ADD_RELATION"; meta: ActionMeta; relation: Relation; index?: number }
  | { type: "REMOVE_RELATION"; meta: ActionMeta; id: Id }
  | {
      type: "UPDATE_RELATION";
      meta: ActionMeta;
      id: Id;
      patch: Partial<Pick<Relation, "fromCard" | "toCard" | "shape" | "fromAttr">>;
    }
  | { type: "SET_VIAS"; meta: ActionMeta; id: Id; from: Via[]; to: Via[] }
  | { type: "UPDATE_META"; meta: ActionMeta; patch: { title?: string; description?: string } }
  | { type: "SET_COLOR_DESC"; meta: ActionMeta; key: string; from: string; to: string }
  | { type: "REPLACE_DOC"; meta: ActionMeta; from: Doc; to: Doc }
  | { type: "BATCH"; meta: ActionMeta; actions: DocAction[] };

// --- UI actions (ephemeral) -------------------------------------------------

export type UiAction =
  | { type: "SET_SELECTION"; sel: Selection; selIds: Id[] }
  | { type: "SET_VIEWPORT"; scale: number; panX: number; panY: number }
  | { type: "SET_PANEL_WIDTH"; width: number }
  | { type: "SET_CONNECT"; connecting: boolean; connectFrom: Id | null }
  | { type: "SET_MARQUEE"; marquee: Marquee | null }
  | { type: "SET_NEAR"; nearId: Id | null }
  | { type: "SET_NEW_REL"; newRel: NewRel | null; newRelTarget: Id | null }
  | { type: "SET_DRAG_ATTR"; index: number }
  | { type: "OPEN_LOAD_DIALOG"; items: SavedMeta[] }
  | { type: "OPEN_ERROR_DIALOG"; message: string }
  | { type: "CLOSE_DIALOG" }
  | { type: "SET_DRAG_ACTIVE"; active: boolean }
  | { type: "SET_GRID_STYLE"; style: GridStyle }
  | { type: "SET_THEME"; theme: ThemeMode };

export type Action = DocAction | UiAction;

export type DocActionType = DocAction["type"];

const DOC_TYPES = new Set<string>([
  "ADD_ENTITY",
  "REMOVE_ENTITY",
  "MOVE_ENTITY",
  "UPDATE_ENTITY",
  "SET_ENTITY_ATTRS",
  "ADD_RELATION",
  "REMOVE_RELATION",
  "UPDATE_RELATION",
  "SET_VIAS",
  "UPDATE_META",
  "SET_COLOR_DESC",
  "REPLACE_DOC",
  "BATCH",
]);

export function isDocAction(action: Action): action is DocAction {
  return DOC_TYPES.has(action.type);
}

let clientId = "c" + Math.random().toString(36).slice(2, 10);
let seq = 0;

/** This browser tab's identity, used to ignore our own echoed actions. */
export function myClientId(): string {
  return clientId;
}

/** Fresh envelope for a locally-originated action. */
export function nextMeta(): ActionMeta {
  return { id: clientId + ":" + seq++, clientId };
}
