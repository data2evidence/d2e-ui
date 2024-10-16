import { ConceptMappingStateType } from "../../types";
import { ColumnMappingState } from "../state";

export const setColumnMapping = (
  state: ConceptMappingStateType,
  payload: ColumnMappingState
): ConceptMappingStateType => ({
  ...state,
  columnMapping: payload,
});
