import type { Doc, Entity, Relation } from "../state/types.ts";

// A pure `Doc -> Markdown` summary embedded as a comment in the exported SVG,
// for a human — or an LLM asked to "look at this SVG" — to read without
// rendering the file. Deliberately schema-only: colors, positions, and curve
// waypoints never enter this function, so there's nothing to leak by
// omission. Pure and DOM-free, unlike svg-export.ts, so it's testable in
// isolation: given a Doc, assert the string.

export function describeDoc(doc: Doc): string {
  const title = doc.title.trim() || "Untitled diagram";
  const description = doc.description.trim();
  const byId = new Map(doc.entities.map((e) => [e.id, e] as const));

  const sections = [`# ${title}`];
  if (description) sections.push(description);

  sections.push(["## Entities", doc.entities.map(describeEntity).join("\n\n") || "_None._"].join("\n\n"));

  const relationLines = doc.relations
    .map((r) => describeRelation(r, byId))
    .filter((line): line is string => line != null);
  sections.push(["## Relations", relationLines.length ? relationLines.join("\n") : "_None._"].join("\n\n"));

  return sections.join("\n\n") + "\n";
}

function describeEntity(e: Entity): string {
  const attrLines = e.attrs.map((a) => `- ${a.name}: ${a.type}`).join("\n");
  return `### ${e.name}\n${attrLines}`;
}

/** `Entity` or `Entity.attr` when the relation leaves from a specific attribute row. */
function relationEndpointName(entity: Entity, attrIndex: number | null | undefined): string {
  if (attrIndex != null && entity.attrs[attrIndex]) return `${entity.name}.${entity.attrs[attrIndex]!.name}`;
  return entity.name;
}

function describeRelation(r: Relation, byId: Map<string, Entity>): string | null {
  const from = byId.get(r.from);
  const to = byId.get(r.to);
  if (!from || !to) return null;
  const fromCard = (r.fromCard || "").trim();
  const toCard = (r.toCard || "").trim();
  const cardinality = fromCard || toCard ? ` [${fromCard || "?"} to ${toCard || "?"}]` : "";
  return `- ${relationEndpointName(from, r.fromAttr)} → ${to.name}${cardinality}`;
}
