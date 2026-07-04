import type { State, Config, Ui } from "./types.ts";

export const DEFAULT_CONFIG: Config = {
  accent: "#2F6BDB",
  showTypes: true,
  gridStyle: "dots",
};

export interface UiBootOptions {
  gridStyle?: Ui["gridStyle"];
  /** Resolved before boot from localStorage / `prefers-color-scheme` — see index.ts. */
  theme?: Ui["theme"];
}

export function initialUi(opts: UiBootOptions = {}): Ui {
  return {
    sel: null,
    selIds: [],
    viewport: { scale: 1, panX: 30, panY: 24 },
    panelWidth: 300,
    connecting: false,
    connectFrom: null,
    marquee: null,
    nearId: null,
    newRel: null,
    newRelTarget: null,
    dragAttrIndex: -1,
    dialog: null,
    dragActive: false,
    gridStyle: opts.gridStyle ?? DEFAULT_CONFIG.gridStyle,
    theme: opts.theme ?? "light",
  };
}

/** The seed diagram — mirrors the prototype so a fresh page has something to edit. */
export function initialState(config: Config = DEFAULT_CONFIG, theme?: Ui["theme"]): State {
  return {
    config,
    ui: initialUi({ gridStyle: config.gridStyle, theme }),
    doc: {
      entities: [],
      relations: [],
      title: "",
      description: "",
      colorLegend: {},
    },
  };
}
