import { TableState } from "./table-state";
import { FieldState } from "./field-state";

export interface AppState {
  saved: boolean;
  table: TableState;
  field: FieldState;
}

export const initialState: AppState = {
  saved: true,
  table: {
    nodes: [
      {
        id: "table_source_menu",
        type: "sourceTable",
        position: { x: 0, y: 0 },
        style: {
          width: "30vw",
          height: "100vh",
        },
        data: null,
      },
      {
        id: "table_target_menu",
        type: "targetTable",
        position: { x: 700, y: 0 },
        style: {
          width: "30vw",
          height: "100vh",
        },
        data: null,
      },
    ],
    edges: [],
    sourceHandles: [],
    targetHandles: [],
  },
  field: {
    nodes: [
      {
        id: "field_source_menu",
        type: "fieldNode",
        position: { x: 0, y: 0 },
        style: {
          width: "30vw",
          height: "100vh",
        },
        data: { type: "source" },
      },
      {
        id: "field_target_menu",
        type: "fieldNode",
        position: { x: 700, y: 0 },
        style: {
          width: "30vw",
          height: "100vh",
        },
        data: { type: "target" },
      },
    ],
    edges: [],
    sourceHandles: [],
    targetHandles: [],
  },
};
