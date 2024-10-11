import { ReactNode } from "react";
import { ParseResult } from "papaparse";
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
  columns: string[] | undefined;
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

export type RowObject = {
  index: number;
  searchText: string;
  domainId?: string;
};

export type csvData = { name: string; data: ParseResult<any> };
