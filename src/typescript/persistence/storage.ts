import type { Doc, SavedMeta } from "../state/types.ts";
import type { ThemeMode } from "../theme/tokens.ts";
import { genId } from "../utils/id.ts";

// Diagram persistence in localStorage.
//
// Layout:
//   enred.v2.index         → SavedMeta[]  (the catalogue, newest first)
//   enred.v2.doc.<id>      → Doc          (one entry per saved diagram)
//   enred.v2.theme         → "light" | "dark"
//
// Saves are keyed by name: saving under an existing name overwrites it rather
// than piling up duplicates.

const INDEX_KEY = "enred.v2.index";
const DOC_PREFIX = "enred.v2.doc.";
const THEME_KEY = "enred.v2.theme";

/** The user's last-chosen theme, or null if never set (caller falls back to
 *  system preference / default). */
export function loadThemePreference(): ThemeMode | null {
  const raw = localStorage.getItem(THEME_KEY);
  return raw === "light" || raw === "dark" ? raw : null;
}

export function saveThemePreference(theme: ThemeMode): void {
  localStorage.setItem(THEME_KEY, theme);
}

function readIndex(): SavedMeta[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as SavedMeta[]) : [];
  } catch {
    return [];
  }
}

function writeIndex(items: SavedMeta[]): void {
  localStorage.setItem(INDEX_KEY, JSON.stringify(items));
}

/** The catalogue of saved diagrams, newest first. */
export function listSaved(): SavedMeta[] {
  return readIndex()
    .slice()
    .sort((a, b) => b.savedAt - a.savedAt);
}

/** Persist `doc` under `name`, overwriting any existing diagram with that name. */
export function saveDiagram(name: string, doc: Doc): SavedMeta {
  const trimmed = name.trim() || "Untitled diagram";
  const index = readIndex();
  const existing = index.find((m) => m.name === trimmed);
  const meta: SavedMeta = { id: existing?.id ?? genId("d"), name: trimmed, savedAt: Date.now() };
  const next = existing ? index.map((m) => (m.id === meta.id ? meta : m)) : [...index, meta];
  localStorage.setItem(DOC_PREFIX + meta.id, JSON.stringify(doc));
  writeIndex(next);
  return meta;
}

/** Load a saved diagram's document, or null if it's missing / corrupt. */
export function loadDiagram(id: string): Doc | null {
  try {
    const raw = localStorage.getItem(DOC_PREFIX + id);
    return raw ? (JSON.parse(raw) as Doc) : null;
  } catch {
    return null;
  }
}

/** Remove a saved diagram and its catalogue entry. */
export function deleteDiagram(id: string): void {
  localStorage.removeItem(DOC_PREFIX + id);
  writeIndex(readIndex().filter((m) => m.id !== id));
}
