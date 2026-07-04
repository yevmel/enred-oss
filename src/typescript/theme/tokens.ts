// Design tokens: every color/shadow value the view layer uses that should
// change between light and dark mode. Components read these off `vm.theme`
// (see view/derive.ts) instead of hardcoding hex values, so adding a theme is
// a matter of adding a token object here, not touching every template.
//
// Diagram content colors (entity.color, the SWATCHES palette, config.accent)
// are NOT tokens — those are user choices the theme must not override.

export type ThemeMode = "light" | "dark";

export interface Theme {
  mode: ThemeMode;

  /** Outermost app background, behind the toolbar/canvas/panel. */
  appBg: string;
  /** White-card surfaces: toolbar groups, props panel, dialogs, inputs. */
  surface: string;
  /** Hover tint for buttons sitting on `surface`. */
  surfaceHover: string;
  /** The canvas's own background, distinct from the app shell. */
  canvasBg: string;

  /** Standard 1px border for panels/inputs/canvas. */
  border: string;
  /** Softer border: card header underlines, list-row separators. */
  borderSubtle: string;
  /** Vertical divider between buttons inside a toolbar group. */
  divider: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  /** Unselected entity card / relation label border. */
  entityBorder: string;
  /** Unselected relation line + endpoint dot stroke. */
  edgeStroke: string;
  /** Drag-handle and delete-icon glyphs at rest. */
  iconMuted: string;

  gridCross: string;
  gridDots: string;

  /** Attribute row background, at rest and while being drag-reordered. */
  rowBg: string;
  rowBgActive: string;
  /** Track background for the Grid/Shape segmented toggles. */
  toggleTrackBg: string;

  dangerBorder: string;
  dangerBg: string;
  dangerBgHover: string;
  dangerText: string;

  /** Dialog backdrop. */
  overlayBackdrop: string;
  /** "R,G,B" triple for `rgba(${shadowRgb},alpha)` box-shadows. */
  shadowRgb: string;
  /** Inset ring around color swatches, so they read as distinct circles against `surface`. */
  swatchRing: string;
  /** % of the entity's own color mixed into `surface` for its header tint —
   *  higher in dark mode, where a 12% mix (right for white) is imperceptible. */
  entityTintRatio: number;
}

export const LIGHT_THEME: Theme = {
  mode: "light",
  appBg: "#E9E9EC",
  surface: "#FFFFFF",
  surfaceHover: "#F4F4F6",
  canvasBg: "#F6F6F7",
  border: "#E0E0E4",
  borderSubtle: "#ECECEF",
  divider: "#E7E7EA",
  textPrimary: "#26262B",
  textSecondary: "#5A5C66",
  textMuted: "#9A9CA6",
  entityBorder: "#E3E3E8",
  edgeStroke: "#B9BBC4",
  iconMuted: "#B3B4BC",
  gridCross: "#D6D6DB",
  gridDots: "#D2D2D8",
  rowBg: "#F7F7F8",
  rowBgActive: "#EDF3FC",
  toggleTrackBg: "#F2F2F4",
  dangerBorder: "#F0DCDC",
  dangerBg: "#FDF7F7",
  dangerBgHover: "#FBEDED",
  dangerText: "#C05555",
  overlayBackdrop: "rgba(20,22,30,0.28)",
  shadowRgb: "30,34,50",
  swatchRing: "rgba(0,0,0,0.1)",
  entityTintRatio: 12,
};

export const DARK_THEME: Theme = {
  mode: "dark",
  appBg: "#17181C",
  surface: "#24252B",
  surfaceHover: "#2E2F37",
  canvasBg: "#1B1C21",
  border: "#3A3B44",
  borderSubtle: "#33343B",
  divider: "#34353D",
  textPrimary: "#EDEDF0",
  textSecondary: "#A7A9B4",
  textMuted: "#787A87",
  entityBorder: "#3D3E48",
  edgeStroke: "#585A66",
  iconMuted: "#656674",
  gridCross: "#2C2D34",
  gridDots: "#34353D",
  rowBg: "#2B2C33",
  rowBgActive: "#232C42",
  toggleTrackBg: "#1C1D22",
  dangerBorder: "#5A3232",
  dangerBg: "#2E1F1F",
  dangerBgHover: "#3B2626",
  dangerText: "#E48787",
  overlayBackdrop: "rgba(0,0,0,0.55)",
  shadowRgb: "0,0,0",
  swatchRing: "rgba(255,255,255,0.16)",
  entityTintRatio: 26,
};

export function getTheme(mode: ThemeMode): Theme {
  return mode === "dark" ? DARK_THEME : LIGHT_THEME;
}

/** `camelCase` -> `--kebab-case` for publishing a token as a CSS custom property. */
function kebab(key: string): string {
  return key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
}

/**
 * Serializes every CSS-representable token to `--token-name:value;` pairs, for
 * inlining into the app root's `style` attribute (alongside `--accent`) so
 * plain CSS (`:hover`, `:focus` — see index.css) can react to the theme too.
 */
export function themeStyleVars(theme: Theme): string {
  return Object.entries(theme)
    .filter(([key]) => key !== "mode" && key !== "entityTintRatio")
    .map(([key, value]) => `--${kebab(key)}:${value}`)
    .join(";");
}
