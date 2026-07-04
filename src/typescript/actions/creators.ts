import type { Attr, Doc, Entity, Position, Relation, Via } from "../state/types.ts";
import type { DocAction } from "./types.ts";
import { nextMeta } from "./types.ts";

// Thin constructors that stamp each doc action with a fresh envelope. Keeps the
// controller free of `meta: nextMeta()` noise and makes the action shapes obvious.

export const addEntity = (entity: Entity, index?: number): DocAction => ({
  type: "ADD_ENTITY",
  meta: nextMeta(),
  entity,
  ...(index != null ? { index } : {}),
});

export const removeEntity = (id: string): DocAction => ({ type: "REMOVE_ENTITY", meta: nextMeta(), id });

export const moveEntity = (id: string, from: Position, to: Position): DocAction => ({
  type: "MOVE_ENTITY",
  meta: nextMeta(),
  id,
  from,
  to,
});

export const updateEntity = (id: string, patch: Partial<Pick<Entity, "name" | "color">>): DocAction => ({
  type: "UPDATE_ENTITY",
  meta: nextMeta(),
  id,
  patch,
});

export const setEntityAttrs = (id: string, from: Attr[], to: Attr[]): DocAction => ({
  type: "SET_ENTITY_ATTRS",
  meta: nextMeta(),
  id,
  from,
  to,
});

export const addRelation = (relation: Relation, index?: number): DocAction => ({
  type: "ADD_RELATION",
  meta: nextMeta(),
  relation,
  ...(index != null ? { index } : {}),
});

export const removeRelation = (id: string): DocAction => ({ type: "REMOVE_RELATION", meta: nextMeta(), id });

export const updateRelation = (
  id: string,
  patch: Partial<Pick<Relation, "fromCard" | "toCard" | "shape" | "fromAttr">>,
): DocAction => ({ type: "UPDATE_RELATION", meta: nextMeta(), id, patch });

export const setVias = (id: string, from: Via[], to: Via[]): DocAction => ({
  type: "SET_VIAS",
  meta: nextMeta(),
  id,
  from,
  to,
});

export const updateMeta = (patch: { title?: string; description?: string }): DocAction => ({
  type: "UPDATE_META",
  meta: nextMeta(),
  patch,
});

export const setColorDesc = (key: string, from: string, to: string): DocAction => ({
  type: "SET_COLOR_DESC",
  meta: nextMeta(),
  key,
  from,
  to,
});

export const replaceDoc = (from: Doc, to: Doc): DocAction => ({ type: "REPLACE_DOC", meta: nextMeta(), from, to });

export const batch = (actions: DocAction[]): DocAction => ({ type: "BATCH", meta: nextMeta(), actions });
