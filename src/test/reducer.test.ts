import { describe, expect, test } from "bun:test";
import { reducer } from "../typescript/store/reducer.ts";
import { invert } from "../typescript/store/invert.ts";
import { initialState } from "../typescript/state/initial.ts";
import type { DocAction } from "../typescript/actions/types.ts";
import * as A from "../typescript/actions/creators.ts";
import type { Entity, State } from "../typescript/state/types.ts";

// Round-trip property: applying an action and then its inverse must return the
// document to exactly where it started. This is the invariant the whole undo /
// networking design rests on.
function roundTrips(state: State, action: DocAction): void {
  const before = state.doc;
  const inverse = invert(before, action);
  const after = reducer(state, action);
  const restored = reducer(after, inverse);
  expect(restored.doc).toEqual(before);
}

const s0 = () => initialState();

describe("reducer + invert round-trips", () => {
  test("ADD_ENTITY", () => {
    const e: Entity = { id: "new", name: "New", color: "#000", x: 0, y: 0, attrs: [] };
    roundTrips(s0(), A.addEntity(e));
  });

  test("REMOVE_ENTITY", () => {
    roundTrips(s0(), A.removeEntity("user"));
  });

  test("MOVE_ENTITY", () => {
    roundTrips(s0(), A.moveEntity("user", { x: 96, y: 96 }, { x: 200, y: 300 }));
  });

  test("UPDATE_ENTITY name + color", () => {
    roundTrips(s0(), A.updateEntity("user", { name: "Account", color: "#FF0000" }));
  });

  test("SET_ENTITY_ATTRS reorder", () => {
    const st = s0();
    const attrs = st.doc.entities[0]!.attrs;
    const reordered = [attrs[1]!, attrs[0]!, ...attrs.slice(2)];
    roundTrips(st, A.setEntityAttrs("user", attrs, reordered));
  });

  test("ADD_RELATION", () => {
    roundTrips(s0(), A.addRelation({ id: "rx", from: "user", to: "product", fromCard: "1", toCard: "N" }));
  });

  test("REMOVE_RELATION", () => {
    roundTrips(s0(), A.removeRelation("r1"));
  });

  test("UPDATE_RELATION", () => {
    roundTrips(s0(), A.updateRelation("r1", { fromCard: "1", toCard: "M", shape: "straight" }));
  });

  test("SET_VIAS", () => {
    roundTrips(s0(), A.setVias("r1", [], [{ x: 10, y: 20 }]));
  });

  test("UPDATE_META", () => {
    roundTrips(s0(), A.updateMeta({ title: "Shop", description: "orders" }));
  });

  test("SET_COLOR_DESC", () => {
    roundTrips(s0(), A.setColorDesc("#3B6FD4", "", "primary"));
  });

  test("BATCH (delete entity + its relations)", () => {
    roundTrips(s0(), A.batch([A.removeRelation("r1"), A.removeEntity("user")]));
  });

  test("REPLACE_DOC (load)", () => {
    const other = initialState().doc;
    other.title = "Loaded";
    other.entities = other.entities.slice(0, 1);
    roundTrips(s0(), A.replaceDoc(s0().doc, other));
  });
});

describe("reducer behaviour", () => {
  test("MOVE_ENTITY sets absolute position", () => {
    const st = reducer(s0(), A.moveEntity("user", { x: 96, y: 96 }, { x: 5, y: 7 }));
    const e = st.doc.entities.find((x) => x.id === "user")!;
    expect(e.x).toBe(5);
    expect(e.y).toBe(7);
  });

  test("BATCH applies sub-actions in order", () => {
    const st = reducer(s0(), A.batch([A.removeRelation("r1"), A.removeEntity("user")]));
    expect(st.doc.entities.find((e) => e.id === "user")).toBeUndefined();
    expect(st.doc.relations.find((r) => r.id === "r1")).toBeUndefined();
  });

  test("reducer never mutates the input state", () => {
    const st = s0();
    const snapshot = JSON.stringify(st);
    reducer(st, A.moveEntity("user", { x: 96, y: 96 }, { x: 999, y: 999 }));
    expect(JSON.stringify(st)).toBe(snapshot);
  });

  test("UI action updates only the ui slice", () => {
    const st = s0();
    const next = reducer(st, { type: "SET_PANEL_WIDTH", width: 420 });
    expect(next.ui.panelWidth).toBe(420);
    expect(next.doc).toBe(st.doc); // doc untouched (structural sharing)
  });
});
