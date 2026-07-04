import type { Entity, Position, Relation, Via } from "../state/types.ts";

// Pure geometry helpers shared by the derive layer and the interaction
// controller. No DOM, no state — just numbers in, numbers out. The magic
// constants mirror the entity card layout in the templates.

export const ENTITY_W = 220;
export const HEADER_H = 40;
/** Gap between an entity edge and where a relation attaches. */
export const REL_GAP = 10;
export const ATTR_ROW_H = 29;
/** Vertical offset from an entity's top to the centre of its first attribute row. */
export const ATTR_ROW_OFFSET = 58.5;
export const GRID = 8;

export function entHeight(en: Entity): number {
  return 50 + en.attrs.length * ATTR_ROW_H;
}

/** Y of the relation's source point: an attribute row if `fromAttr` set, else the header. */
export function sourceY(a: Entity, fromAttr: number | null | undefined): number {
  if (fromAttr != null && a.attrs[fromAttr]) return a.y + ATTR_ROW_OFFSET + fromAttr * ATTR_ROW_H;
  return a.y + HEADER_H / 2;
}

export function relEndpoints(a: Entity, b: Entity, rel: Relation): { p1: Position; p2: Position } {
  return {
    p1: { x: a.x + ENTITY_W + REL_GAP, y: sourceY(a, rel.fromAttr) },
    p2: { x: b.x - REL_GAP, y: b.y + HEADER_H / 2 },
  };
}

/** SVG path `d` for a relation given its endpoints and optional waypoints. */
export function edgePath(p1: Position, p2: Position, vias: Via[], straight: boolean): string {
  const pts = [p1, ...vias, p2];
  if (vias.length === 0) {
    if (straight) return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
    const k = Math.max(50, Math.abs(p2.x - p1.x) * 0.5);
    const c1 = { x: p1.x + k, y: p1.y };
    const c2 = { x: p2.x - k, y: p2.y };
    return `M ${p1.x} ${p1.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
  }
  // Catmull-Rom spline through every point.
  let d = `M ${pts[0]!.x} ${pts[0]!.y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const q0 = pts[i - 1] || pts[i]!;
    const q1 = pts[i]!;
    const q2 = pts[i + 1]!;
    const q3 = pts[i + 2] || q2;
    const c1 = { x: q1.x + (q2.x - q0.x) / 6, y: q1.y + (q2.y - q0.y) / 6 };
    const c2 = { x: q2.x - (q3.x - q1.x) / 6, y: q2.y - (q3.y - q1.y) / 6 };
    d += ` C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${q2.x} ${q2.y}`;
  }
  return d;
}

/** Point `dist` px along the segment from `from` toward `to` (clamped to 40% of its length). */
export function along(from: Position, to: Position, dist: number): Position {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const L = Math.hypot(dx, dy) || 1;
  const dd = Math.min(dist, L * 0.4);
  return { x: from.x + (dx / L) * dd, y: from.y + (dy / L) * dd };
}

export function distToSeg(p: Position, s: Position, t: Position): number {
  const dx = t.x - s.x;
  const dy = t.y - s.y;
  const l2 = dx * dx + dy * dy || 1;
  let u = ((p.x - s.x) * dx + (p.y - s.y) * dy) / l2;
  u = Math.max(0, Math.min(1, u));
  const cx = s.x + u * dx;
  const cy = s.y + u * dy;
  return Math.hypot(p.x - cx, p.y - cy);
}

/** Index at which a waypoint should be inserted so the click lands on the nearest segment. */
export function insertIndex(p1: Position, p2: Position, vias: Via[], w: Position): number {
  const pts = [p1, ...vias, p2];
  let bi = 0;
  let best = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = distToSeg(w, pts[i]!, pts[i + 1]!);
    if (d < best) {
      best = d;
      bi = i;
    }
  }
  return bi;
}

/** Which entity (if any) contains world point `w`, excluding `exclude`. */
export function entityAt(entities: Entity[], w: Position, exclude?: string): string | null {
  let hit: string | null = null;
  for (const en of entities) {
    if (en.id === exclude) continue;
    if (w.x >= en.x && w.x <= en.x + ENTITY_W && w.y >= en.y && w.y <= en.y + entHeight(en)) hit = en.id;
  }
  return hit;
}

/** Nearest entity within `maxDist` of world point `w`, for showing the out-handle. */
export function nearestEntity(entities: Entity[], w: Position, maxDist = 46): string | null {
  let near: string | null = null;
  let best = maxDist;
  for (const en of entities) {
    const dx = Math.max(en.x - w.x, 0, w.x - (en.x + ENTITY_W));
    const dy = Math.max(en.y - w.y, 0, w.y - (en.y + entHeight(en)));
    const d = Math.hypot(dx, dy);
    if (d < best) {
      best = d;
      near = en.id;
    }
  }
  return near;
}

/** Entity ids intersecting a marquee rectangle in world space. */
export function entitiesInRect(entities: Entity[], x: number, y: number, w: number, h: number): string[] {
  return entities
    .filter((en) => en.x < x + w && en.x + ENTITY_W > x && en.y < y + h && en.y + entHeight(en) > y)
    .map((en) => en.id);
}

export function snap(v: number): number {
  return Math.round(v / GRID) * GRID;
}

/** Axis-aligned bounding box of every entity card in world space, or null if empty. */
export function entitiesBounds(entities: Entity[]): { x: number; y: number; w: number; h: number } | null {
  if (!entities.length) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const en of entities) {
    minX = Math.min(minX, en.x);
    minY = Math.min(minY, en.y);
    maxX = Math.max(maxX, en.x + ENTITY_W);
    maxY = Math.max(maxY, en.y + entHeight(en));
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}
