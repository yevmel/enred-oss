import type { Config, Doc, Entity, Relation } from "../state/types.ts";
import { ENTITY_W, HEADER_H, REL_GAP, along, edgePath, entHeight, entitiesBounds, sourceY } from "../geometry/geometry.ts";
import { DEFAULT_ENTITY_COLOR, hexTint } from "../utils/colors.ts";
import { escapeCdata, escapeXmlComment, escapeXmlText } from "../utils/xml.ts";
import { slugify } from "../utils/slug.ts";
import { describeDoc } from "./describe.ts";

// Renders `Doc` to a self-contained SVG file: a static visual (built from the
// same geometry helpers the interactive canvas uses, so the two can't drift
// apart), plus two embeds for two different readers — see feature-import-export.md.
//
//   <metadata id="enred-state">  exact JSON `Doc`, for EnReD's own Import.
//   <!-- markdown -->            lossy-by-design content summary, for humans/LLMs.
//
// This module (unlike describe.ts) touches the DOM — `hexTint` resolves
// arbitrary CSS colors via a canvas 2D context — so it only runs in the
// browser, consistent with the rest of the interaction layer.

export const SVG_FORMAT_VERSION = "1";

const PAD = 48;

/** `when` defaults to now; exposed as a parameter so filename generation stays testable. */
export function exportFilename(doc: Doc, when: Date = new Date()): string {
  const slug = slugify(doc.title) || "diagram";
  return `${slug}-${formatTimestamp(when)}.svg`;
}

function formatTimestamp(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const time = `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  return `${date}-${time}`;
}

export function renderDiagramSvg(doc: Doc, config: Config): string {
  const bounds = entitiesBounds(doc.entities) ?? { x: 0, y: 0, w: 0, h: 0 };
  const minX = bounds.x - PAD;
  const minY = bounds.y - PAD;
  const width = Math.max(1, bounds.w + PAD * 2);
  const height = Math.max(1, bounds.h + PAD * 2);

  const byId = new Map(doc.entities.map((e) => [e.id, e] as const));
  const defs: string[] = [];
  const entityMarkup = doc.entities.map((e) => renderEntity(e, config, defs)).join("\n");
  const relationMarkup = doc.relations
    .map((r) => renderRelation(r, byId))
    .filter((s): s is string => s != null)
    .join("\n");

  const title = escapeXmlText(doc.title.trim() || "Untitled diagram");
  const stateJson = escapeCdata(
    JSON.stringify({
      entities: doc.entities,
      relations: doc.relations,
      title: doc.title,
      description: doc.description,
      colorLegend: doc.colorLegend,
    }),
  );
  const comment = escapeXmlComment(describeDoc(doc));

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<!--\n${comment}-->`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${width} ${height}" width="${width}" height="${height}">`,
    `<title>${title}</title>`,
    `<metadata id="enred-state" data-format-version="${SVG_FORMAT_VERSION}"><![CDATA[${stateJson}]]></metadata>`,
    defs.length ? `<defs>${defs.join("")}</defs>` : "",
    `<rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="#F6F6F7"></rect>`,
    relationMarkup,
    entityMarkup,
    `</svg>`,
  ]
    .filter(Boolean)
    .join("\n");
}

function safeId(id: string): string {
  return id.replace(/[^A-Za-z0-9_-]/g, "_");
}

function renderEntity(e: Entity, config: Config, defs: string[]): string {
  const w = ENTITY_W;
  const h = entHeight(e);
  const color = e.color || DEFAULT_ENTITY_COLOR;
  const tint = hexTint(color);
  const clipId = "card-" + safeId(e.id);
  defs.push(`<clipPath id="${clipId}"><rect x="${e.x}" y="${e.y}" width="${w}" height="${h}" rx="10"></rect></clipPath>`);

  const rows: string[] = [
    `<rect x="${e.x}" y="${e.y}" width="${w}" height="${h}" rx="10" fill="#FFFFFF" stroke="#E3E3E8" stroke-width="1"></rect>`,
    `<rect x="${e.x}" y="${e.y}" width="${w}" height="${HEADER_H}" fill="${tint}" clip-path="url(#${clipId})"></rect>`,
    `<line x1="${e.x}" y1="${e.y + HEADER_H}" x2="${e.x + w}" y2="${e.y + HEADER_H}" stroke="#ECECEF" stroke-width="1"></line>`,
    `<circle cx="${e.x + 22}" cy="${e.y + HEADER_H / 2}" r="4" fill="${color}"></circle>`,
    text(e.x + 34, e.y + HEADER_H / 2 + 5, e.name, { size: 14, weight: 600, color: "#26262B" }),
  ];

  e.attrs.forEach((a, i) => {
    const cy = sourceY(e, i) + 4;
    rows.push(text(e.x + 14, cy, a.name, { size: 13, color: "#26262B" }));
    if (config.showTypes) {
      rows.push(text(e.x + w - 14, cy, a.type, { size: 11, color: "#9A9CA6", mono: true, anchor: "end" }));
    }
  });

  return rows.join("\n");
}

function renderRelation(r: Relation, byId: Map<string, Entity>): string | null {
  const a = byId.get(r.from);
  const b = byId.get(r.to);
  if (!a || !b) return null;
  const p1 = { x: a.x + ENTITY_W + REL_GAP, y: sourceY(a, r.fromAttr) };
  const p2 = { x: b.x - REL_GAP, y: b.y + HEADER_H / 2 };
  const vias = r.vias || [];
  const d = edgePath(p1, p2, vias, (r.shape || "s-curve") === "straight");
  const pts = [p1, ...vias, p2];

  const parts = [
    `<path d="${d}" fill="none" stroke="#B9BBC4" stroke-width="1.5"></path>`,
    `<circle cx="${p1.x}" cy="${p1.y}" r="4" fill="#FFFFFF" stroke="#B9BBC4" stroke-width="1.5"></circle>`,
    `<circle cx="${p2.x}" cy="${p2.y}" r="4" fill="#FFFFFF" stroke="#B9BBC4" stroke-width="1.5"></circle>`,
  ];

  const la = along(p1, pts[1]!, 34);
  const lb = along(p2, pts[pts.length - 2]!, 34);
  if (r.fromCard && r.fromCard.trim()) parts.push(renderCardinalityLabel(la.x, la.y - 14, r.fromCard));
  if (r.toCard && r.toCard.trim()) parts.push(renderCardinalityLabel(lb.x, lb.y - 14, r.toCard));

  return parts.join("\n");
}

function renderCardinalityLabel(x: number, y: number, label: string): string {
  const w = Math.max(18, label.length * 6.5 + 14);
  const h = 18;
  return [
    `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="#FFFFFF" stroke="#E3E3E8" stroke-width="1"></rect>`,
    text(x, y + 4, label, { size: 11, color: "#7A7C86", anchor: "middle" }),
  ].join("\n");
}

interface TextOpts {
  size: number;
  color: string;
  weight?: number;
  mono?: boolean;
  anchor?: "start" | "middle" | "end";
}

function text(x: number, y: number, content: string, opts: TextOpts): string {
  const family = opts.mono ? "ui-monospace, Menlo, monospace" : "'Helvetica Neue', Helvetica, Arial, sans-serif";
  const anchor = opts.anchor && opts.anchor !== "start" ? ` text-anchor="${opts.anchor}"` : "";
  const weight = opts.weight ? ` font-weight="${opts.weight}"` : "";
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${opts.size}" fill="${opts.color}"${weight}${anchor}>${escapeXmlText(content)}</text>`;
}
