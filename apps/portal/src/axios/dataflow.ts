import request from "./request";
import env from "../env";
import { Flow, ExecuteFlowRunByDeployment, CreateFlowRunByMetadata } from "../types";

const DATAFLOW_MGMT_URL = `${env.REACT_APP_DN_BASE_URL}dataflow-mgmt/`;

export class Dataflow {
  public getFlows() {
    return request<Flow[]>({
      baseURL: DATAFLOW_MGMT_URL,
      url: "prefect/flow/list",
      method: "GET",
    });
  }

  public getDeploymentByFlowId(id: string) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: `prefect/flow/${id}/deployment`,
      method: "GET",
    });
  }

  public addFlowFromFileDeployment(file?: File) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: `prefect/flow/file-deployment`,
      method: "POST",
      data: { file },
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 600000,
    });
  }

  public addFlowFromGitUrlDeployment(url: string) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: `prefect/flow/git-deployment`,
      method: "POST",
      data: { url },
      timeout: 600000,
    });
  }

  public executeFlowRunByDeployment(data: ExecuteFlowRunByDeployment) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: `prefect/flow-run/deployment`,
      method: "POST",
      data: data,
    });
  }

  public deleteFlow(id: string) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: `prefect/flow/${id}`,
      method: "DELETE",
    });
  }

  public getFlowRuns(filter: string) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: "job-history/flow-runs",
      method: "GET",
      params: {
        filter: filter,
      },
    });
  }

  public cancelFlowRun(flowRunId: string) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: `prefect/flow-run/${flowRunId}/cancellation`,
      method: "POST",
      data: {},
    });
  }

  public getFlowMetadata() {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: "prefect/flow/metadata/list",
      method: "GET",
    });
  }

  public getDataQualityDataflowResults(flowRunId: string) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: `dqd/data-quality/flow-run/${flowRunId}/results`,
      method: "GET",
    });
  }

  public getDataQualityDataflowOverview(flowRunId: string) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: `dqd/data-quality/flow-run/${flowRunId}/overview`,
      method: "GET",
    });
  }

  public getDatasetLatestFlowRun(jobType: string, datasetId: string) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: `dqd/${jobType}/dataset/${datasetId}/flow-run/latest`,
      method: "GET",
    });
  }

  public getDatasetReleaseFlowRun(jobType: string, datasetId: string, releaseId: string) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: `dqd/${jobType}/dataset/${datasetId}/release/${releaseId}/flow-run`,
      method: "GET",
    });
  }

  public useDataQualityDatasetLatestCohortFlowRun(datasetId: string, cohortDefinitionId: string) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: `dqd/data-quality/dataset/${datasetId}/cohort/${cohortDefinitionId}/flow-run/latest`,
      method: "GET",
    });
  }

  public getDataCharacterizationResults(flowRunId: string, sourceKey: string): Promise<any> {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: `dqd/data-characterization/flow-run/${flowRunId}/results/${sourceKey}`,
      method: "GET",
    });
  }

  public getDataCharacterizationResultsDrilldown(
    flowRunId: string,
    sourceKey: string,
    conceptId: string
  ): Promise<any> {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: `dqd/data-characterization/flow-run/${flowRunId}/results/${sourceKey}/${conceptId}`,
      method: "GET",
    });
  }

  public getHistoricalDataQuality(datasetId: string) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: `dqd/data-quality/dataset/${datasetId}/history`,
      method: "GET",
    });
  }

  public getHistoricalDataQualityByCategory(datasetId: string) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: `dqd/data-quality/dataset/${datasetId}/category/history`,
      method: "GET",
    });
  }

  public getHistoricalDataQualityByDomain(datasetId: string) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: `dqd/data-quality/dataset/${datasetId}/domain/history`,
      method: "GET",
    });
  }

  public getDomainContinuity(datasetId: string) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: `dqd/data-quality/dataset/${datasetId}/domain/continuity`,
      method: "GET",
    });
  }

  public createFlowRunByMetadata(data: CreateFlowRunByMetadata) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: "prefect/flow-run/metadata",
      method: "POST",
      data: data,
    });
  }

  public getDatamodels() {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: "prefect/flow/datamodels/list",
      method: "GET",
    });
  }

  public getFlowRunState(flowId: string) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: `prefect/flow-run/${flowId}/state`,
      method: "GET",
    });
  }
}