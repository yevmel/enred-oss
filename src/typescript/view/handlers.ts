// The contract between the pure view components and the interaction controller.
// Components stay side-effect free: they receive this object and wire its
// callbacks into the DOM. The controller (interaction/controller.ts) implements
// it, translating raw DOM events into dispatched actions.

import type { GridStyle } from "../state/types.ts";

export interface Handlers {
  // toolbar
  addEntity(): void;
  toggleConnect(): void;
  undo(): void;
  redo(): void;
  zoomIn(): void;
  zoomOut(): void;
  zoomReset(): void;
  fitToScreen(): void;
  toggleTheme(): void;

  // save / load
  saveDiagram(): void;
  openLoadDialog(): void;
  loadSaved(id: string): void;
  deleteSaved(id: string): void;
  closeDialog(): void;

  // import / export
  exportDiagram(): void;
  openImportPicker(): void;

  // canvas
  onCanvasDown(e: MouseEvent): void;
  onCanvasDblClick(e: MouseEvent): void;
  onCanvasMove(e: MouseEvent): void;
  onCanvasLeave(): void;
  onWheel(e: WheelEvent): void;
  onEntityDown(e: MouseEvent, id: string): void;
  onEdgeDown(e: MouseEvent, relId: string): void;
  onEdgeRemoveVias(e: MouseEvent, relId: string): void;
  onRelSelect(e: MouseEvent, relId: string): void;
  onHandleDown(e: MouseEvent, relId: string, index: number): void;
  onHandleRemove(e: MouseEvent, relId: string, index: number): void;
  onOutHandleDown(e: MouseEvent, id: string, attr: number | null): void;
  onPanelResizeDown(e: MouseEvent): void;

  // props panel
  onDiagramTitle(value: string): void;
  onDiagramDesc(value: string): void;
  onGridStyle(style: GridStyle): void;
  onColorDesc(key: string, value: string): void;
  onEntityName(value: string): void;
  onEntityColorSwatch(key: string): void;
  onEntityColorText(value: string): void;
  onRelShape(shape: "s-curve" | "straight"): void;
  onRelCard(end: "from" | "to", value: string): void;
  onAttrName(index: number, value: string): void;
  onAttrType(index: number, value: string): void;
  onAttrRemove(index: number): void;
  onAttrAdd(): void;
  onAttrDragStart(e: MouseEvent, index: number): void;
  onAttrRowEnter(index: number): void;
  onFieldFocus(): void;
  deleteSelected(): void;
}
