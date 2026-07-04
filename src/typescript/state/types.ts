import type { ThemeMode } from "../theme/tokens.ts";

// The single source of truth for the application's shape.
//
// State is split into three slices:
//   - `doc`    the diagram itself. This is the ONLY slice that is reversible
//              (undo/redo) and networked (sent over the WebSocket).
//   - `ui`     ephemeral view state (selection, viewport, in-flight gestures).
//              Never historised, never networked.
//   - `config` render-time options coming from the host (accent, grid, …).
//
// The whole object is treated as immutable — the reducer always returns a new
// object and never mutates a nested value in place.

export type Id = string;

export interface Attr {
  name: string;
  type: string;
}

export interface Entity {
  id: Id;
  name: string;
  color: string;
  x: number;
  y: number;
  attrs: Attr[];
}

export interface Via {
  x: number;
  y: number;
}

export type RelShape = "s-curve" | "straight";

export type GridStyle = "cross" | "dots" | "none";

export interface Relation {
  id: Id;
  from: Id;
  to: Id;
  fromCard: string;
  toCard: string;
  /** Index of the source attribute the relation leaves from, or null for the header. */
  fromAttr?: number | null;
  shape?: RelShape;
  /** Curvature waypoints; when present the edge is a spline through them. */
  vias?: Via[];
}

/** The reversible, networked part of the state. */
export interface Doc {
  entities: Entity[];
  relations: Relation[];
  title: string;
  description: string;
  /** Maps a colour hex to a human description shown in the legend. */
  colorLegend: Record<string, string>;
}

export interface Position {
  x: number;
  y: number;
}

export type Selection = { kind: "ent" | "rel"; id: Id } | null;

export interface Viewport {
  scale: number;
  panX: number;
  panY: number;
}

export interface Marquee {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface NewRel {
  from: Id;
  fromAttr: number | null;
  x: number;
  y: number;
}

/** Metadata for a diagram persisted in localStorage. */
export interface SavedMeta {
  id: string;
  name: string;
  savedAt: number;
}

/** Which modal overlay (if any) is open. Its data is snapshotted into state so
 *  the render stays a pure function of state (no localStorage reads at render). */
export type Dialog =
  | null
  | { kind: "load"; items: SavedMeta[] }
  | { kind: "error"; message: string };

/** Ephemeral view state. */
export interface Ui {
  sel: Selection;
  selIds: Id[];
  viewport: Viewport;
  panelWidth: number;
  connecting: boolean;
  connectFrom: Id | null;
  marquee: Marquee | null;
  nearId: Id | null;
  newRel: NewRel | null;
  newRelTarget: Id | null;
  /** Index of the attribute row currently being drag-reordered, or -1. */
  dragAttrIndex: number;
  /** The open modal overlay, if any. */
  dialog: Dialog;
  /** True while a file is being dragged over the window (Import via drag-and-drop). */
  dragActive: boolean;
  /** Canvas background pattern. A view preference, so it lives here rather than `doc` — not undoable, not networked. */
  gridStyle: GridStyle;
  /** Light/dark UI theme — a view preference, persisted to localStorage (see theme/tokens.ts, index.ts). */
  theme: ThemeMode;
}

export interface Config {
  accent: string;
  showTypes: boolean;
  /** Seeds `ui.gridStyle` at boot; the host's initial preference, not a live-controlled value. */
  gridStyle: GridStyle;
}

export interface State {
  doc: Doc;
  ui: Ui;
  config: Config;
}
