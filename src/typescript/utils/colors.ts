// Entity colour presets and the header-tint helper.

export const SWATCHES = ["#3B6FD4", "#7C5CD4", "#2B9D8F", "#C08A2E", "#CE5C7C", "#6B7280"];

export const DEFAULT_ENTITY_COLOR = "#6B7280";

/**
 * A wash of `color` toward `base` (the card surface), used for the entity
 * header background. `ratio` is a 0-100 color-mix percentage of `color` —
 * dark surfaces need a much stronger mix than white to read as tinted at all,
 * hence it's a parameter rather than a fixed 12%; see Theme.entityTintRatio.
 */
export function tintOf(color: string, base: string, ratio: number): string {
  return `color-mix(in srgb, ${color} ${ratio}%, ${base})`;
}

/**
 * A light wash of `color` as a literal `#rrggbb` hex, for contexts that can't
 * rely on CSS `color-mix()` — e.g. the exported SVG file, which should render
 * identically in any viewer, not just browsers with modern CSS color support.
 */
export function hexTint(color: string, ratio = 0.12): string {
  const hex = normalizeToHex(color);
  if (!hex) return color;
  const n = parseInt(hex, 16);
  const mix = (c: number) => Math.round(c * ratio + 255 * (1 - ratio));
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

/**
 * Resolves any CSS color string (hex, named, `rgb()`, …) to a bare 6-digit hex
 * via the canvas 2D context's own color parser, or null if it can't be
 * resolved (e.g. `currentColor`, garbage input).
 */
function normalizeToHex(color: string): string | null {
  const direct = /^#?([0-9a-f]{6})$/i.exec(color.trim());
  if (direct) return direct[1]!.toLowerCase();
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#000000";
    ctx.fillStyle = color;
    const normalized = /^#([0-9a-f]{6})$/i.exec(ctx.fillStyle);
    return normalized ? normalized[1]!.toLowerCase() : null;
  } catch {
    return null;
  }
}
