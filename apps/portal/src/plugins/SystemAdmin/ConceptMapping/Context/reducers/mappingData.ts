import { ConceptMappingStateType, csvDataType, conceptDataType } from "../../types";
import { csvData } from "../../types";
import { StandardConcepts } from "../../../../Researcher/Terminology/utils/types";

export const setInitialData = (state: ConceptMappingStateType, payload: csvDataType): ConceptMappingStateType => {
  const data = payload.data.map((d: Object) => ({ ...d, status: "unchecked" }));
  return { ...state, csvData: { ...payload, data } };
};

export const clearData = (state: ConceptMappingStateType): ConceptMappingStateType => ({
  ...state,
  csvData: {
    name: "",
    columns: [],
    data: [],
  },
});

export const updateSingleMapping = (
  state: ConceptMappingStateType,
  payload: conceptDataType
): ConceptMappingStateType => {
  const index = state.csvData.data.findIndex((data) => data === state.selectedData);
  return {
    ...state,
    csvData: {
      ...state.csvData,
      data: [
        ...state.csvData.data.slice(0, index),
        {
          ...state.csvData.data[index],
          conceptId: payload.conceptId,
          conceptName: payload.conceptName,
          domainId: payload.domainId,
          status: "checked",
        },
        ...state.csvData.data.slice(index + 1),
      ],
    },
  };
};

export const updateMultipleMapping = (
  state: ConceptMappingStateType,
  payload: StandardConcepts[]
): ConceptMappingStateType => {
  return {
    ...state,
    csvData: {
      ...state.csvData,
      data: state.csvData.data.map((row, index) => {
        const updatedRow = payload.find((item) => item.index === index);
        if (updatedRow) {
          const { index: _, ...rest } = updatedRow;
          return { ...row, ...rest, status: "checked" };
        }
        return row;
      }),
    },
  };
};

export const setSelectedData = (state: ConceptMappingStateType, payload: Object): ConceptMappingStateType => ({
  ...state,
  selectedData: payload,
});

export const clearSelectedData = (state: ConceptMappingStateType): ConceptMappingStateType => ({
  ...state,
  selectedData: {},
});
