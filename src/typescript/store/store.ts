import type { Doc, State } from "../state/types.ts";
import type { Action, DocAction, UiAction } from "../actions/types.ts";
import { myClientId, nextMeta } from "../actions/types.ts";
import { reducer } from "./reducer.ts";
import { invert } from "./invert.ts";

// The store is the orchestrator: the only place with side effects (render
// scheduling, notifying subscribers). The reducer and `invert` stay pure.
//
// Every mutation goes through a dispatch path whose *origin* — not the action
// type — decides history and networking:
//
//   local    reducer + push history + notify local-action subscribers
//   undo/redo reducer + move pointer + notify   (no new history entry)
//   remote   reducer only (ignores our own echo)
//   preview  reducer + render only              (in-flight drag, no history/notify)
//   ui       reducer + render only              (ephemeral view state)
//
// The store has no concept of networking at all — not even an abstract
// "transport" shape. Real-time collaboration is a closed-source feature: this
// package only exposes (1) `subscribeLocalActions`, fired with every action
// *this* client originates, and (2) `dispatchRemote`/`applyRemoteState` to
// feed actions or a full snapshot back in from wherever they came from. What
// happens in between — a WebSocket, anything else — is entirely up to
// whoever subscribes; the store just notifies, it doesn't know or care.

interface HistoryEntry {
  action: DocAction;
  inverse: DocAction;
}

interface History {
  entries: HistoryEntry[];
  /** Index of the last-applied entry; -1 when fully undone / empty. */
  pointer: number;
}

export interface StoreOptions {
  render: (state: State) => void;
}

export class Store {
  state: State;
  private history: History = { entries: [], pointer: -1 };
  private renderView: (state: State) => void;
  private renderScheduled = false;
  private localActionSubs = new Set<(action: DocAction) => void>();

  constructor(initial: State, opts: StoreOptions) {
    this.state = initial;
    this.renderView = opts.render;
  }

  /**
   * Registers a callback fired with every locally-originated action (from
   * `dispatch`, `undo`, `redo`). Returns an unsubscribe function. This is the
   * store's only notion of networking — it has no idea what a subscriber
   * does with the action.
   */
  subscribeLocalActions(fn: (action: DocAction) => void): () => void {
    this.localActionSubs.add(fn);
    return () => this.localActionSubs.delete(fn);
  }

  private notifyLocal(action: DocAction): void {
    for (const fn of this.localActionSubs) fn(action);
  }

  // --- Public dispatch API --------------------------------------------------

  /** A local user action: applied, historised, and notified. */
  dispatch(action: DocAction): void {
    const inverse = invert(this.state.doc, action);
    this.state = reducer(this.state, action);
    // Truncate any redo tail, then push and advance the pointer.
    this.history.entries.length = this.history.pointer + 1;
    this.history.entries.push({ action, inverse });
    this.history.pointer++;
    this.notifyLocal(action);
    this.scheduleRender();
  }

  /** An ephemeral view change (selection, viewport, in-flight gesture). */
  dispatchUi(action: UiAction): void {
    this.state = reducer(this.state, action);
    this.scheduleRender();
  }

  /**
   * Apply a doc action optimistically without touching history — used during a
   * continuous gesture (dragging). The gesture's single committed action is
   * dispatched via `dispatch` on release, so undo sees exactly one entry.
   */
  preview(action: DocAction): void {
    this.state = reducer(this.state, action);
    this.scheduleRender();
  }

  undo(): void {
    if (this.history.pointer < 0) return;
    const entry = this.history.entries[this.history.pointer]!;
    this.state = reducer(this.state, entry.inverse);
    this.history.pointer--;
    this.notifyLocal(entry.inverse);
    this.scheduleRender();
  }

  redo(): void {
    if (this.history.pointer >= this.history.entries.length - 1) return;
    const entry = this.history.entries[this.history.pointer + 1]!;
    this.state = reducer(this.state, entry.action);
    this.history.pointer++;
    this.notifyLocal(entry.action);
    this.scheduleRender();
  }

  /** An action arriving from elsewhere (e.g. another client via a subscriber's socket). */
  dispatchRemote(action: DocAction): void {
    if (action.meta.clientId === myClientId()) return; // our own echo
    this.state = reducer(this.state, action);
    this.scheduleRender();
  }

  /**
   * A full-document snapshot from elsewhere, replacing the local diagram
   * wholesale — e.g. a collaboration backend's initial-state replay on join
   * (see SPEC/05-collab.md's `applyRemoteState`). Applied directly through
   * the reducer, bypassing history (it's not a user action) and the echo
   * check (it isn't one of our own actions being relayed back).
   */
  applyRemoteState(doc: Doc): void {
    this.state = reducer(this.state, { type: "REPLACE_DOC", meta: nextMeta(), from: this.state.doc, to: doc });
    this.scheduleRender();
  }

  // --- Introspection --------------------------------------------------------

  canUndo(): boolean {
    return this.history.pointer >= 0;
  }

  canRedo(): boolean {
    return this.history.pointer < this.history.entries.length - 1;
  }

  // --- Render scheduling ----------------------------------------------------

  /**
   * Coalesced re-render. Many schedule calls before the microtask runs collapse
   * into a single render that flushes before paint, matching lit's scheduling.
   */
  private scheduleRender(): void {
    if (this.renderScheduled) return;
    this.renderScheduled = true;
    queueMicrotask(() => {
      this.renderScheduled = false;
      this.renderView(this.state);
    });
  }

  /** Force a synchronous render — used once at boot. */
  renderNow(): void {
    this.renderView(this.state);
  }
}

// Re-export so callers can build a store without knowing about actions module.
export type { Action };
