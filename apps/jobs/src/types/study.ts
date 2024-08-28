export interface Tenant {
  id: string
  name: string
  system: string
  customDbName?: string
}

export interface StudyDetail {
  id: string
  name: string
  summary: string
  description: string
  showRequestAccess: boolean
}

export interface StudyAttribute {
  id: number
  attributeId: string
  value: string
  studyId: string
  attributeConfig: StudyAttributeConfig
}

export interface StudyAttributeConfig {
  name: string
  dataType: string
  isDisplayed: string
}

export interface StudyTag {
  id: number
  studyId: string
  name: string
}

export interface DatasetDashboard {
  name: string
  url: string
  basePath: string
  id?: string
}

export interface Study {
  id: string
  tenant: Tenant
  tokenStudyCode: string
  schemaName: string
  vocabSchemaName?: string
  type: string
  visibilityStatus: string
  publicKey: string
  dataModel: string
  databaseCode: string
  dialect?: string
  paConfigId: string

  studyDetail?: StudyDetail
  attributes?: StudyAttribute[]
  tags?: StudyTag[]
  dashboards: DatasetDashboard[]
}

export enum DatasetQueryRole {
  systemAdmin = 'systemAdmin'
}
