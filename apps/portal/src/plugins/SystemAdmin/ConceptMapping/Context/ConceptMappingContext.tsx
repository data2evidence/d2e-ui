import React, { FC, createContext, useReducer } from "react";
import { ConceptMappingProviderProps, ConceptMappingStateType, actionType } from "../types";
import { FirstConcepts } from "../../../Researcher/Terminology/utils/types";
export const ConceptMappingContext = createContext<any>(null);
export const ConceptMappingDispatchContext = createContext<any>(null);

const columnMappingReducer = (state: ConceptMappingStateType, action: actionType) => {
  switch (action.type) {
    case "UPDATE_COLUMN_MAPPING":
      return { ...state, columnMapping: action.data };
    default:
      return state;
  }
};

const csvDataReducer = (state: ConceptMappingStateType, action: actionType) => {
  switch (action.type) {
    case "ADD_IMPORT_DATA":
      const importColumns = action.data.data.meta.fields;
      const importName = action.data.name;
      const iData = action.data.data.data;
      const importData = { name: importName, columns: importColumns, data: iData };
      return { ...state, importData: importData };
    case "CLEAR_IMPORT_DATA":
      return {
        ...state,
        importData: {
          name: "",
          columns: [],
          data: [],
        },
      };
    case "ADD_CSV_DATA":
      const data = action.data.data.map((d: any) => {
        return {
          ...d,
          status: "unchecked",
        };
      });
      const csvData = { ...action.data, data };
      return { ...state, csvData: csvData };
    case "CLEAR_CSV_DATA":
      return {
        ...state,
        csvData: {
          name: "",
          columns: [],
          data: [],
        },
      };
    case "UPDATE_CSV_DATA":
      const index = state.csvData.data.findIndex((data) => data === state.selectedData);
      return {
        ...state,
        csvData: {
          ...state.csvData,
          data: [
            ...state.csvData.data.slice(0, index),
            {
              ...state.csvData.data[index],
              conceptId: action.data.conceptId,
              conceptName: action.data.conceptName,
              domainId: action.data.domainId,
              status: "checked",
            },
            ...state.csvData.data.slice(index + 1),
          ],
        },
      };
    default:
      return state;
  }
};

const updateMultipleRows = (
  state: ConceptMappingStateType,
  action: {
    type: string;
    data: FirstConcepts[];
  }
) => {
  switch (action.type) {
    case "UPDATE_MULTIPLE_ROWS":
      const updateMap = new Map<
        string,
        {
          conceptId: number;
          conceptName: string;
          domainId: string;
          status?: string;
        }
      >();

      action.data.forEach((update) => {
        const key = JSON.stringify(update.row);
        updateMap.set(key, {
          conceptId: update.result.conceptId,
          conceptName: update.result.conceptName,
          domainId: update.result.domainId,
          status: "checked",
        });
      });

      const updatedData = state.csvData.data.map((row) => {
        const key = JSON.stringify(row);
        const update = updateMap.get(key);

        if (update) {
          return {
            ...row,
            conceptId: update.conceptId,
            conceptName: update.conceptName,
            domainId: update.domainId,
            status: update.status,
          };
        }
        return row;
      });

      return {
        ...state,
        csvData: {
          ...state.csvData,
          data: updatedData,
        },
      };

    default:
      return state;
  }
};

const selectedDataReducer = (state: ConceptMappingStateType, action: actionType) => {
  switch (action.type) {
    case "ADD_SELECTED_DATA":
      return { ...state, selectedData: action.data };
    case "CLEAR_SELECTED_DATA":
      return {
        ...state,
        selectedData: {},
      };
    default:
      return state;
  }
};

// combine all reducers into one
// https://stackoverflow.com/questions/57296549/hooks-combine-multiple-reducers-when-using-usereducer

const combineReducers =
  (...reducers: Function[]) =>
  (state: ConceptMappingStateType, action: actionType) =>
    reducers.reduce((newState, reducer) => reducer(newState, action), state);

const initialState: ConceptMappingStateType = {
  importData: {
    name: "",
    columns: [],
    data: [],
  },
  csvData: {
    name: "",
    columns: [],
    data: [],
  },
  selectedData: {},
  columnMapping: {
    sourceCode: "",
    sourceName: "",
    sourceFrequency: "",
    description: "",
  },
  filters: {},
};

export const ConceptMappingProvider: FC<ConceptMappingProviderProps> = ({ children }) => {
  const combinedReducers = combineReducers(
    columnMappingReducer,
    csvDataReducer,
    selectedDataReducer,
    updateMultipleRows
  );
  const [state, dispatch] = useReducer(combinedReducers, initialState);
  return (
    <ConceptMappingContext.Provider value={state}>
      <ConceptMappingDispatchContext.Provider value={dispatch}>{children}</ConceptMappingDispatchContext.Provider>
    </ConceptMappingContext.Provider>
  );
};
