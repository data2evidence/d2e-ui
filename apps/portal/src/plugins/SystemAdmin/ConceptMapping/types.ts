import { ReactNode } from "react";
import { ParseResult } from "papaparse";
export interface ConceptMappingProviderProps {
  children?: ReactNode;
}

export type ConceptMappingState = {
  importData: csvDataType;
  csvData: csvDataType;
  selectedData: { [key: string]: string };
  columnMapping: columnMappingType;
  filters: filters;
};

export type csvDataType = {
  name: string;
  columns: string[] | undefined;
  data: Array<mappingData>;
};

export type mappingData = conceptData & {
  status: string;
  [key: string]: any; // columnn mapping keys
};

export type conceptData = {
  conceptId: number;
  conceptName: string;
  domainId: string;
  system: string;
  validStartDate: string;
  validEndDate: string;
  validity: string;
};

export type columnMappingType = {
  sourceCode: string;
  sourceName: string;
  sourceFrequency: string;
  description: string;
  domainId?: string;
};

export type filters = {};

export type RowObject = {
  index: number;
  searchText: string;
  domainId?: string;
};

export type csvData = { name: string; data: ParseResult<any> };
