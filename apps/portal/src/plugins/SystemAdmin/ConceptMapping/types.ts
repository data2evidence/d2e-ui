import { ReactNode } from "react";

export interface ConceptMappingProviderProps {
  children?: ReactNode;
}

export type ConceptMappingStateType = {
  importData: csvDataType;
  csvData: csvDataType;
  selectedData: Object;
  columnMapping: columnMappingType;
  filters: filters;
};

export type csvDataType = {
  name: string;
  columns: [];
  data: Array<Object>;
};

export type columnMappingType = {
  sourceCode: string;
  sourceName: string;
  sourceFrequency: string;
  description: string;
};

export type filters = {};

export type actionType = {
  type: string;
  data: any;
};

export type conceptDataType = {
  conceptId: number;
  conceptName: string;
  domainId: string;
};
