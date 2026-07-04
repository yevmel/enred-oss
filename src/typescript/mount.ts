import "../css/index.css";

import { render } from "lit-html";
import type { Config, State } from "./state/types.ts";
import { DEFAULT_CONFIG, initialState } from "./state/initial.ts";
import { Store } from "./store/store.ts";
import { createController } from "./interaction/controller.ts";
import type { Handlers } from "./view/handlers.ts";
import { app } from "./view/app.ts";
import * as A from "./actions/creators.ts";
import { loadThemePreference } from "./persistence/storage.ts";
import type { ThemeMode } from "./theme/tokens.ts";
import "./view/toolbar-builtins.ts";

// Public entry point: this is the one thing a host application (including
// EnReD's own `index.ts`, below, and a closed-source app depending on this
// package) is expected to call. It wires the store, the interaction
// controller, and the lit-html render loop into `container`, then does the
// first paint.
//
//   store.render  ── effect ──▶  render(app(state), container)
//   DOM events    ── controller ─▶ store.dispatch(...)
//
// Deliberately a plain function rather than a side effect of importing this
// module: a host decides *when* and *where* to mount, this file doesn't
// assume a `#app` element exists anywhere.
//
// Importing this module also registers EnReD's own toolbar groups via
// `registerToolbarItem` (see view/toolbar-registry.ts) — toolbar.ts itself
// stays generic. A closed-source layer adding its own buttons imports its own
// registrations file the same way, before calling `mountEnRed`.

export interface MountOptions {
  config?: Partial<Config>;
}

export interface Mounted {
  store: Store;
}

function resolveBootTheme(): ThemeMode {
  const stored = loadThemePreference();
  if (stored) return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function mountEnRed(container: HTMLElement, options: MountOptions = {}): Mounted {
  const bootConfig: Config = { ...DEFAULT_CONFIG, ...(options.config ?? {}) };

  // Theme resolution order: the user's last explicit choice (localStorage),
  // else the OS/browser preference, else light. Resolved synchronously before
  // the first render so there's no flash of the wrong theme.
  let handlers: Handlers;

  const store = new Store(initialState(bootConfig, resolveBootTheme()), {
    render: (state: State) =>
      render(app(state, handlers, { canUndo: store.canUndo(), canRedo: store.canRedo() }), container),
  });

  handlers = createController(store);
  store.renderNow();

  // Debug escape hatch: strips every relation's curvature waypoints in one
  // go, dispatched as a single batch so it's one undo step like any other
  // edit. The `__` prefix marks it as internal, not part of the public API.
  window.__removeAllCurvatureHandles = () => {
    const actions = store.state.doc.relations
      .filter((r) => r.vias && r.vias.length)
      .map((r) => A.setVias(r.id, r.vias!, []));
    if (actions.length) store.dispatch(A.batch(actions));
  };

  return { store };
}

declare global {
  interface Window {
    /** Debug escape hatch, not part of the public API — see above. */
    __removeAllCurvatureHandles?: () => void;
  }
}
