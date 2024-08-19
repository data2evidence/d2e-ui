import { AppState, initialState } from "../states";

export const reset = () => initialState;

export const load = (state: AppState, payload: Partial<AppState>) => ({
  ...state,
  ...payload,
  saved: true,
});

export const clearHandles = (state: AppState) => ({
  ...state,
  saved: false,
  table: { ...state.table, edges: [] },
  field: { ...state.field, edges: [] },
});

export const markAsSaved = (state: AppState) => ({
  ...state,
  saved: true,
});
