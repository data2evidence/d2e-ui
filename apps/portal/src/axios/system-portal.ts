import request from "./request";
import env from "../env";
import {
  NewStudyDetailInput,
  Study,
  Tenant,
  IFeature,
  SystemFeature,
  UpdateStudyMetadataInput,
  UpdateStudyDetailInput,
  DatasetFilter,
  DatasetQueryRole,
  CreateHanaReleaseInput,
  PaConfig,
  DatasetTagConfig,
  DatasetAttributeConfig,
  FeatureInput,
  Config,
} from "../types";

const SYSTEM_PORTAL_URL = `${env.REACT_APP_DN_BASE_URL}system-portal/`;

export class SystemPortal {
  public getTenants() {
    return request<Tenant[]>({
      baseURL: SYSTEM_PORTAL_URL,
      url: "tenant/list",
      method: "GET",
    });
  }

  public getFeatures() {
    return request<IFeature[]>({
      baseURL: SYSTEM_PORTAL_URL,
      url: "feature/list",
      method: "GET",
    });
  }

  public setFeatures(features: FeatureInput[]) {
    return request<IFeature[]>({
      baseURL: SYSTEM_PORTAL_URL,
      url: "feature",
      method: "POST",
      data: { features },
    });
  }

  public getDataset(id: string) {
    return request<Study>({
      baseURL: SYSTEM_PORTAL_URL,
      url: `dataset/${id}`,
      method: "GET",
    });
  }

  public getDatasets(role: DatasetQueryRole, searchText: string | undefined, params: URLSearchParams) {
    params.set("role", role);
    if (searchText) params.set("searchText", searchText);

    return request<Study[]>({
      baseURL: SYSTEM_PORTAL_URL,
      url: "dataset/list",
      method: "GET",
      params,
    });
  }

  public createDatasetDetail(dataset: NewStudyDetailInput) {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: "dataset/detail",
      method: "POST",
      data: dataset,
    });
  }

  public updateDatasetDetail(dataset: UpdateStudyDetailInput) {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: "dataset/detail",
      method: "PUT",
      data: dataset,
    });
  }

  public deleteDataset(id: string) {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: `dataset/${id}`,
      method: "DELETE",
    });
  }

  public getDatasetFilterScopes() {
    return request<DatasetFilter>({
      baseURL: SYSTEM_PORTAL_URL,
      url: "dataset/filter-scopes",
      method: "GET",
    });
  }

  public getSystemFeatures() {
    return request<SystemFeature[]>({
      baseURL: SYSTEM_PORTAL_URL,
      url: "system/feature/list",
      method: "GET",
    });
  }

  public updateDataset(metadata: UpdateStudyMetadataInput) {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: "dataset",
      method: "PUT",
      data: metadata,
    });
  }

  public getResources(datasetId: string) {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: `dataset/${datasetId}/resource/list`,
      method: "GET",
    });
  }

  public addResource(datasetId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file, file.name);

    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: `dataset/${datasetId}/resource`,
      method: "POST",
      data: formData,
    });
  }

  public deleteResource(datasetId: string, filename: string) {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: `dataset/${datasetId}/resource/${filename}`,
      method: "DELETE",
    });
  }

  public downloadResource(datasetId: string, filename: string) {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: `dataset/${datasetId}/resource/${filename}/download`,
      method: "GET",
      responseType: "blob",
    });
  }

  public getPublicDatasets(searchText: string | undefined) {
    const params = new URLSearchParams();
    if (searchText) params.set("searchText", searchText);

    return request<Study[]>({
      baseURL: SYSTEM_PORTAL_URL,
      url: "dataset/public/list",
      method: "GET",
      params,
    });
  }

  public createDatasetRelease(input: CreateHanaReleaseInput) {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: `dataset/release`,
      method: "POST",
      data: input,
    });
  }

  getPaConfigs(): Promise<PaConfig[]> {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: `pa-config/metadata/list`,
      method: "GET",
    });
  }

  public getDatasetReleases(datasetId: string) {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: `dataset/${datasetId}/release/list`,
      method: "GET",
    });
  }

  public getDatasetTagConfigs() {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: `dataset/metadata-config/tag/list`,
      method: "GET",
    });
  }

  public addDatasetTagConfig(tagConfig: DatasetTagConfig) {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: `dataset/metadata-config/tag`,
      method: "POST",
      data: tagConfig,
    });
  }

  public deleteDatasetTagConfig(name: string) {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: `dataset/metadata-config/tag/${name}`,
      method: "DELETE",
    });
  }

  public getDatasetAttributeConfigs() {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: `dataset/metadata-config/attribute/list`,
      method: "GET",
    });
  }

  public addDatasetAttributeConfig(attributeConfig: DatasetAttributeConfig) {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: `dataset/metadata-config/attribute`,
      method: "POST",
      data: attributeConfig,
    });
  }

  public updateDatasetAttributeConfig(attributeConfig: DatasetAttributeConfig) {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: `dataset/metadata-config/attribute`,
      method: "PUT",
      data: attributeConfig,
    });
  }

  public deleteDatasetAttributeConfig(id: string) {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: `dataset/metadata-config/attribute/${id}`,
      method: "DELETE",
    });
  }

  public getDashboardByName(name: string) {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: `dataset/dashboard/${name}`,
      method: "GET",
    });
  }

  public getDashboards() {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: `dataset/dashboards/list`,
      method: "GET",
    });
  }

  public getPublicOverviewDescription() {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: "config/public/overview-description",
      method: "GET",
    });
  }

  public getOverviewDescription() {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: "config/overview-description",
      method: "GET",
    });
  }

  public updateConfig(config: Config) {
    return request({
      baseURL: SYSTEM_PORTAL_URL,
      url: `config`,
      method: "PUT",
      data: config,
    });
  }
}
