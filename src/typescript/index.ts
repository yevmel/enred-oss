import { mountEnRed } from "./mount.ts";
import type { Config } from "./state/types.ts";

// Entry point for EnReD's own standalone build (`bun run dev` / `build`).
// Everything past this file is `mountEnRed` — see mount.ts for why. This
// package has no networking of any kind (real-time collaboration is a
// closed-source feature — see Store.subscribeLocalActions), so the
// standalone demo just runs with no backend at all.

declare global {
  interface Window {
    __ENRED__?: { config?: Partial<Config> };
  }
}

const root = document.getElementById("app");
if (!root) throw new Error("index: #app mount point missing");

mountEnRed(root, { config: window.__ENRED__?.config });
