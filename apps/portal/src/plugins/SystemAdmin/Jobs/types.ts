export interface HistoryJob {
  flowRunId: string;
  flowRunName: string;
  schemaName: string;
  dataCharacterizationSchema: string;
  cohortDefinitionId: string;
  type: string;
  createdAt: string;
  completedAt: string;
  status: string;
  error: string | null;
  datasetId: string | null;
  comment: string | null;
  databaseCode: string;
}

export enum FlowRunJobStateTypes {
  "COMPLETED" = "COMPLETED",
  "SCHEDULED" = "SCHEDULED",
  "PENDING" = "PENDING",
  "RUNNING" = "RUNNING",
  "PAUSED" = "PAUSED",
  "CANCELLING" = "CANCELLING",
  "CANCELLED" = "CANCELLED",
  "FAILED" = "FAILED",
  "CRASHED" = "CRASHED",
}
