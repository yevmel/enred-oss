import type { Attr, Doc, Entity, Relation } from "../state/types.ts";
import { SVG_FORMAT_VERSION } from "./svg-export.ts";

// The other half of the round-trip: `File text -> Doc`, or a rejection with a
// message fit to show the user directly. Strict XML parsing means a
// hand-edited/corrupted file fails at step 1 rather than silently producing
// a half-broken diagram.

export type ImportResult = { ok: true; doc: Doc } | { ok: false; error: string };

export function parseDiagramSvg(text: string): ImportResult {
  const root = new DOMParser().parseFromString(text, "image/svg+xml");
  if (root.querySelector("parsererror")) {
    return { ok: false, error: "This file could not be parsed as SVG — it may be corrupted." };
  }

  const meta = root.querySelector('[id="enred-state"]');
  if (!meta) {
    return { ok: false, error: "This SVG wasn't exported from EnReD — no embedded diagram data found." };
  }

  const version = meta.getAttribute("data-format-version");
  if (version !== SVG_FORMAT_VERSION) {
    return {
      ok: false,
      error: `This SVG was exported by an incompatible version of EnReD (format ${version ?? "unknown"}, expected ${SVG_FORMAT_VERSION}).`,
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(meta.textContent ?? "");
  } catch {
    return { ok: false, error: "The embedded diagram data is corrupted and could not be read." };
  }

  const doc = asDoc(parsed);
  if (!doc) {
    return { ok: false, error: "The embedded diagram data doesn't match the expected shape." };
  }
  return { ok: true, doc };
}

function asDoc(value: unknown): Doc | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (!Array.isArray(v.entities) || !v.entities.every(isEntity)) return null;
  if (!Array.isArray(v.relations) || !v.relations.every(isRelation)) return null;
  if (typeof v.title !== "string" || typeof v.description !== "string") return null;
  if (!v.colorLegend || typeof v.colorLegend !== "object" || Array.isArray(v.colorLegend)) return null;
  return {
    entities: v.entities,
    relations: v.relations,
    title: v.title,
    description: v.description,
    colorLegend: v.colorLegend as Record<string, string>,
  };
}

function isEntity(e: unknown): e is Entity {
  if (!e || typeof e !== "object") return false;
  const x = e as Record<string, unknown>;
  return (
    typeof x.id === "string" &&
    typeof x.name === "string" &&
    typeof x.color === "string" &&
    typeof x.x === "number" &&
    typeof x.y === "number" &&
    Array.isArray(x.attrs) &&
    x.attrs.every(isAttr)
  );
}

function isAttr(a: unknown): a is Attr {
  if (!a || typeof a !== "object") return false;
  const x = a as Record<string, unknown>;
  return typeof x.name === "string" && typeof x.type === "string";
}

function isRelation(r: unknown): r is Relation {
  if (!r || typeof r !== "object") return false;
  const x = r as Record<string, unknown>;
  return (
    typeof x.id === "string" &&
    typeof x.from === "string" &&
    typeof x.to === "string" &&
    typeof x.fromCard === "string" &&
    typeof x.toCard === "string"
  );
}
