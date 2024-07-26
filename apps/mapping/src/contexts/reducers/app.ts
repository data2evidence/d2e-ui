import { AppState, initialState } from "../states";

export const reset = () => initialState;

export const clearHandles = (state: AppState) => ({
  table: { ...state.table, edges: [] },
  field: { ...state.field, edges: [] },
});
