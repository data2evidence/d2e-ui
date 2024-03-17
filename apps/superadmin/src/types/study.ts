import { Tenant } from "./tenant";

export interface Study {
  id: string;
  tenantId: string;
  tenant: Tenant;
  tokenStudyCode: string;
  schemaName: string;
  type: string;
  visibilityStatus: string;
  publicKey: string;

  studyDetail?: StudyDetail;
  studyDashboards?: StudyDashboard[];
  studyMetadata?: StudyMetadata[];
  studyTags?: StudyTag[];
  studySystem?: StudySystem;
  tokens: TokenMapping[];
}

export interface NewStudyInput {
  type: string;
  tokenStudyCode: string;
  tenantId: string;
  databaseName: string;
  schemaOption: string;
  cdmSchemaValue: string;
  tenantName?: string;
}

export interface CopyStudyInput {
  newStudyName: string;
  sourceStudyId: string;
  snapshotLocation: string;
  snapshotCopyConfig?: SnapshotCopyConfig;
}

export interface SnapshotCopyConfig {
  timestamp?: string;
  tableConfig?: SnapshotCopyTableConfig[];
  patientsToBeCopied?: string[];
}

export interface SnapshotCopyTableConfig {
  tableName: string;
  columnsToBeCopied: string[];
}

export interface StudyDetail {
  id: number;
  name: string;
  summary: string;
  description: string;
  showTokenGen: boolean;
  tokenGenText: string;
  showRequestAccess: boolean;
}

export interface NewStudyDetailInput {
  studyId: string;
  name: string;
  summary: string;
  description: string;
  showTokenGen: boolean;
  tokenGenText: string;
  showRequestAccess: boolean;
}

export interface UpdateStudyDetailInput {
  id: number;
  name: string;
  summary: string;
  description: string;
  showTokenGen: boolean;
  tokenGenText: string;
  showRequestAccess: boolean;
}

export interface StudyDashboard {
  id: number;
  studyId: string;
  name: string;
  url: string;
}

export interface StudyMetadata {
  dataType: string;
  id: number;
  studyId: string;
  name: string;
  value: string;
}

export interface StudyTag {
  id: number;
  studyId: string;
  name: string;
}

export interface UpdateStudyDashboardInput {
  id: number;
  name: string;
  url: string;
}

export interface NewStudyDashboardInput {
  name: string;
  studyId: string;
  url: string;
}

export interface StudyUserRole {
  role: string;
  granted: "pending" | "approved" | "rejected";
}

export interface StudyUserWithRoles {
  userId: string;
  userEmail: string;
  roles: string[];
}

export interface NewStudyAttributeInput {
  name: string;
  value: string;
  dataType: string;
}
export interface UpdateStudyMetadataInput {
  id: string;
  tokenStudyCode: string;
  type: string;
  visibilityStatus: string;
  studyAttributes: NewStudyAttributeInput[];
  studyTags: string[];
}

export interface TokenMapping {
  id: number;
  externalId: string;
  token: string;
  status: string;
  generatedDate: string;
  lastDonationDate: string;
  studyId: string;
  validationDate: string;
}

export interface TokenData {
  tokens: TokenMapping[];
}

export interface GenerateTokenInput {
  externalId: string;
  studyId: string;
}

export interface GenerateMultipleTokenInput {
  externalIds: string[];
  studyId: string;
}

export interface OffboardStudyInput {
  studyId: string;
}

export interface TokenStudyCodes {
  tokenStudyCode: string;
}

export interface StudyMetadata {
  id: number;
  name: string;
  value: string;
}

export interface StudySystem {
  id: number;
  name: string;
}
