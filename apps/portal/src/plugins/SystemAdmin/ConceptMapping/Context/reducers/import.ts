import { ConceptMappingStateType } from "../../types";
import { csvData } from "../../types";

export const setImportData = (state: ConceptMappingStateType, payload: csvData): ConceptMappingStateType => {
  const importColumns = payload.data.meta.fields;
  const importName = payload.name;
  const importedData = payload.data.data;
  const importData = { name: importName, columns: importColumns, data: importedData };
  return { ...state, importData: importData };
};

export const clearImportData = (state: ConceptMappingStateType): ConceptMappingStateType => ({
  ...state,
  importData: {
    name: "",
    columns: [],
    data: [],
  },
});
