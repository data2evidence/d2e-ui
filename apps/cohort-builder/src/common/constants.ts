export enum DistinctOption {
  STANDARD_CONCEPT = 'standard_concept',
  START_DATE = 'start_date',
  VISIT = 'visit',
}

export const DistinctOptionNames: Record<DistinctOption, string> = {
  standard_concept: 'Standard concept',
  start_date: 'Start date',
  visit: 'Visit',
}

export enum OccurrenceType {
  AT_MOST = 'at_most',
  EXACTLY = 'exactly',
  AT_LEAST = 'at_least',
}

export const OccurrenceTypeNames: Record<OccurrenceType, string> = {
  at_most: 'At most',
  exactly: 'Exactly',
  at_least: 'At least',
}
