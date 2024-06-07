export interface CohortMapping {
  id: string;
  patientIds: string[];
  name: string;
  description: string;
  creationTimestamp: Date;
  modificationTimestamp: Date | string;
  owner: string;
}
export interface CohortDefinitionList {
  cohortDefinitionCount: number;
  data: CohortMapping[];
}
