export interface Flow {
  id: string;
  created: string;
  updated: string;
  name: string;
  tages: string[];
}

export interface MetaData {
  createdBy: string;
  created_date: string;
  modifiedBy: string;
  modified_date: string;
  flowId: string;
  name: string;
  type: string;
  entryPoint: string;
  datamodels: string[];
  url: string;
  others?: {};
}

interface BaseGenerateFlowRun {
  datasetId: string;
  comment: string;
  releaseId?: string;
  vocabSchemaName?: string;
}

export interface GenerateDataQualityFlowRun extends BaseGenerateFlowRun {
  cohortDefinitionId?: string;
}

export interface GenerateDataCharacterizationFlowRun extends BaseGenerateFlowRun {}

export interface ExecuteFlowRunByDeployment {
  flowRunName: string;
  flowName: string;
  deploymentName: string;
  params: object;
}

export interface CreateFlowRunByMetadata {
  type: string;
  flowRunName?: string;
  datamodels?: string[];
  flowId?: string;
  options?: object;
}
