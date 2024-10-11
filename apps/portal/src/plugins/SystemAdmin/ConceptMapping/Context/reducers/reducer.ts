import { ConceptMappingStateType } from "../../types";
import { setColumnMapping } from "./column-mapping";
import { setImportData, clearImportData } from "./import";
import { setSelectedData, clearSelectedData } from "./mappingData";

enum ACTION_TYPES {
  SET_COLUMN_MAPPING = "SET_COLUMN_MAPPING",
  SET_IMPORT_DATA = "SET_IMPORT_DATA",
  CLEAR_IMPORT_DATA = "CLEAR_IMPORT_DATA",
  SET_SELECTED_DATA = "SET_SELECTED_DATA",
  CLEAR_SELECTED_DATA = "CLEAR_SELECTED_DATA",
}

type ActionType = keyof typeof ACTION_TYPES;
type ActionFunction = (state: ConceptMappingStateType, payload?: any) => ConceptMappingStateType;

const actionMap = new Map<ActionType, ActionFunction>([
  [ACTION_TYPES.SET_COLUMN_MAPPING, setColumnMapping],
  [ACTION_TYPES.SET_IMPORT_DATA, setImportData],
  [ACTION_TYPES.CLEAR_IMPORT_DATA, clearImportData],
  [ACTION_TYPES.SET_SELECTED_DATA, setSelectedData],
  [ACTION_TYPES.CLEAR_SELECTED_DATA, clearSelectedData],
]);

export interface DispatchType {
  type: ACTION_TYPES;
  payload?: any;
}

export const reducer = (state: ConceptMappingStateType, { type, payload }: DispatchType) => {
  const mappedAction = actionMap.get(type);
  return mappedAction ? mappedAction(state, payload) : state;
};
