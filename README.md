# EnReD

EnReD is a browser-based editor for drawing entity-relationship (ER) diagrams —
the boxes-and-arrows diagrams used to design database schemas and data models.
Everything happens on one screen: draw entities, connect them with relations,
describe your schema, and save or share the result — no account, no server
round-trip required.

## Getting started

Open the app and you'll see an empty canvas, a toolbar across the top, and a
diagram-settings panel on the right. Click **+ Entity** to place your first
box, or just start exploring — every action described below can be undone.

---

## Entities

An entity is a box representing one "thing" in your data model — a `User`, an
`Order`, a `Product`. Click **+ Entity** in the toolbar, or double-click empty
canvas space, to create one.

- **Move** an entity by dragging its card.
- **Rename** it, and give it a **color**, from the panel on the right — pick
  one of the preset swatches or type any CSS color.
- **Attributes** are the entity's fields (`id`, `email`, `created_at`, …). Add
  them from the panel, give each a name and an optional type, drag the ⣿
  handle to reorder them, or remove them with the × button.
- **Select multiple entities** by shift-clicking them one at a time, or by
  shift-dragging a rubber-band selection box over several at once. Drag any of
  them to move the whole group together, or delete them all in one go.

## Relations

A relation is a line connecting two entities, describing how they relate to
each other (e.g. "a User places many Orders").

- Click **+ Relation** in the toolbar, then click a source entity and a target
  entity to connect them. Or, simply hover over an entity — a small connect
  handle appears on its edge (and next to each attribute, if you want the
  relation to point from that specific field) — and drag it to another entity.
- Selecting a relation lets you set its **label and cardinalities** (e.g. `1`
  on one end, `0..N` on the other) and choose between a smooth **S-curve** or
  a **straight** line.
- **Reshape a relation's curve** by dragging its line — this adds a curvature
  handle you can drag freely. Double-click a handle to remove it.
- Delete a relation by selecting it and pressing Delete/Backspace, or using
  the "Delete relation" button in the panel.

## Navigating the canvas

- **Pan** by dragging empty canvas space.
- **Zoom** with the scroll wheel, or the `−`/`+` buttons in the toolbar.
- **Fit to screen** (the ⤢ button) reframes the view so your entire diagram
  is visible at once.
- Choose a **grid style** — crosses, dots, or none — from the diagram panel.

## Undo & redo

Every change — moving an entity, editing a label, deleting a relation — can be
undone with the ↶ toolbar button or `Cmd/Ctrl+Z`, and redone with ↷ or
`Cmd/Ctrl+Shift+Z` (or `Cmd/Ctrl+Y`).

## The diagram panel

Click empty canvas space to see the diagram-level panel on the right:

- **Title** and **description** for the diagram as a whole.
- **Colors used** — every distinct entity color gets a legend entry where you
  can note what it means (e.g. "blue = core domain", "gray = external system").
- **Grid** style, as above.

Selecting an entity, a relation, or several entities swaps this panel to show
options for that selection instead.

## Saving your work

- **Save** stores the current diagram in your browser (no account or server
  needed) under its title. Saving again under the same title overwrites the
  previous save.
- **Load** shows every diagram you've saved, with the date it was saved, so
  you can pick one to open. You can also delete old saves from this list.

## Sharing & backing up diagrams

- **Export** downloads your diagram as a single, ordinary `.svg` file. It's a
  real image — open it in a browser, an image viewer, or drop it into a
  document — but it also secretly carries the full diagram data inside it, so
  it can be imported right back into EnReD. It's the easiest way to back up
  a diagram, email it to a colleague, or move it to another computer. The file
  also includes a plain-text summary of the entities and relations, so it's
  useful even to someone (or something — like an AI assistant) just reading
  the file without a diagram viewer.
- **Import** loads a diagram back in from an exported `.svg` file — either
  through the **Import** button's file picker, or simply by **dragging the
  file onto the app window**.

## Light & dark mode

Click the sun/moon icon in the toolbar to switch between light and dark
themes. Your choice is remembered the next time you open the app, and if
you've never chosen one, EnReD follows your system's light/dark setting.

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Delete` / `Backspace` | Delete the selected entity, relation, or selection |
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` or `Cmd/Ctrl + Y` | Redo |
| Shift + click | Add/remove an entity from the current selection |
| Shift + drag (empty canvas) | Rubber-band select multiple entities |
| Scroll | Zoom in/out, centered on the cursor |
