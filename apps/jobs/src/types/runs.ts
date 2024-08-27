export enum RUN_TYPES {
  DATA_QUALITY = 'data_quality_dashboard',
  DATA_CHARACTERIZATION = 'data_characterization'
}

export enum JobRunTypes {
  DQD = 'dqd',
  DataCharacterization = 'data_characterization'
}

export type CreateFlowRunByMetadata = {
  type: string
  flowRunName?: string
  datamodels?: string[]
  flowId?: string
  options?: object
}
