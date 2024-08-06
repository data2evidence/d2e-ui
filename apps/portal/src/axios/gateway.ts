import {
  CopyStudyInput,
  NewStudyInput,
  Study,
  CohortDefinitionList,
  UpdateSchemaInput,
  SchemasVersionInfoResponse,
  NewFhirProjectInput,
} from "../types";
import env from "../env";
import request from "./request";

const GATEWAY_BASE_URL = `${env.REACT_APP_DN_BASE_URL}gateway/api`;

export class Gateway {
  public createDataset(input: NewStudyInput): Promise<Study> {
    return request({
      baseURL: GATEWAY_BASE_URL,
      url: `/dataset`,
      method: "POST",
      data: input,
    });
  }

  public copyDataset(input: CopyStudyInput): Promise<any> {
    return request({
      baseURL: GATEWAY_BASE_URL,
      url: `/dataset/snapshot`,
      method: "POST",
      data: input,
    });
  }

  public getCdmSchemaSnapshotMetadata(sourceDatasetId: string) {
    return request({
      baseURL: GATEWAY_BASE_URL,
      url: `/dataset/${sourceDatasetId}/cdm-schema/snapshot/metadata`,
      method: "GET",
    });
  }

  public getAllCohorts(sourceDatasetId: string): Promise<CohortDefinitionList> {
    return request({
      baseURL: GATEWAY_BASE_URL,
      url: `/dataset/${sourceDatasetId}/cohorts`,
      method: "GET",
    });
  }

  public getDatasetDashboards(datasetId: string): Promise<any> {
    return request({
      baseURL: GATEWAY_BASE_URL,
      url: `/dataset/${datasetId}/dashboard/list`,
      method: "GET",
    });
  }

  public getDataModels(dialect: string): Promise<any> {
    return request({
      baseURL: GATEWAY_BASE_URL,
      url: `/db/${dialect}/data-models`,
      method: "GET",
    });
  }

  public getSchemasVersionInformation(
    schemas: string[],
    dialect: string,
    databaseCode: string
  ): Promise<SchemasVersionInfoResponse> {
    return request({
      baseURL: GATEWAY_BASE_URL,
      url: `/db/${dialect}/${databaseCode}/version-info`,
      method: "GET",
      params: {
        schemas: schemas.join(","),
      },
    });
  }

  public updateSchema(input: UpdateSchemaInput): Promise<any> {
    return request({
      baseURL: GATEWAY_BASE_URL,
      url: `/db/schema`,
      method: "PUT",
      data: input,
    });
  }

  public registerDashboardRoutes() {
    return request({
      baseURL: env.REACT_APP_DN_BASE_URL,
      url: "/dashboard-gate/register",
      method: "POST",
    });
  }

  public createFhirStaging(input: NewFhirProjectInput): Promise<any> {
    return request({
      baseURL: GATEWAY_BASE_URL + "/fhir",
      method: "POST",
      data: input,
    });
  }
}
