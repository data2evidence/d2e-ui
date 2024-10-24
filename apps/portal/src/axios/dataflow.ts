import env from "../env";
import { CreateFlowRunByMetadata, ExecuteFlowRunByDeployment, Flow, FlowRunFilters } from "../types";
import request from "./request";

const DATAFLOW_MGMT_URL = `${env.REACT_APP_DN_BASE_URL}dataflow-mgmt/`;
const JOBPLUGIN_URL = `${env.REACT_APP_DN_BASE_URL}jobplugins/`;

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

  public getFlowRuns(filter: string, extraFilters: FlowRunFilters = {}) {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: "job-history/flow-runs",
      method: "GET",
      params: {
        filter,
        ...extraFilters,
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
      baseURL: JOBPLUGIN_URL,
      url: `dqd/data-quality/flow-run/${flowRunId}/results`,
      method: "GET",
    });
  }

  public getDataQualityDataflowOverview(flowRunId: string) {
    return request({
      baseURL: JOBPLUGIN_URL,
      url: `dqd/data-quality/flow-run/${flowRunId}/overview`,
      method: "GET",
    });
  }

  public getDatasetLatestFlowRun(jobType: string, datasetId: string) {
    return request({
      baseURL: JOBPLUGIN_URL,
      url: `dqd/${jobType}/flow-run/latest`,
      method: "GET",
      params: { datasetId: datasetId },
    });
  }

  public getDatasetReleaseFlowRun(jobType: string, datasetId: string, releaseId: string) {
    return request({
      baseURL: JOBPLUGIN_URL,
      url: `dqd/${jobType}/release/${releaseId}/flow-run`,
      method: "GET",
      params: { datasetId: datasetId },
    });
  }

  public useDataQualityDatasetLatestCohortFlowRun(datasetId: string, cohortDefinitionId: string) {
    return request({
      baseURL: JOBPLUGIN_URL,
      url: `dqd/data-quality/cohort/${cohortDefinitionId}/flow-run/latest`,
      method: "GET",
      params: { datasetId: datasetId },
    });
  }

  public getDataCharacterizationResults(flowRunId: string, sourceKey: string): Promise<any> {
    return request({
      baseURL: JOBPLUGIN_URL,
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
      baseURL: JOBPLUGIN_URL,
      url: `dqd/data-characterization/flow-run/${flowRunId}/results/${sourceKey}/${conceptId}`,
      method: "GET",
    });
  }

  public getHistoricalDataQuality(datasetId: string) {
    return request({
      baseURL: JOBPLUGIN_URL,
      url: `dqd/data-quality/history`,
      method: "GET",
      params: { datasetId: datasetId },
    });
  }

  public getHistoricalDataQualityByCategory(datasetId: string) {
    return request({
      baseURL: JOBPLUGIN_URL,
      url: `dqd/data-quality/category/history`,
      method: "GET",
      params: { datasetId: datasetId },
    });
  }

  public getHistoricalDataQualityByDomain(datasetId: string) {
    return request({
      baseURL: JOBPLUGIN_URL,
      url: `dqd/data-quality/domain/history`,
      method: "GET",
      params: { datasetId: datasetId },
    });
  }

  public getDomainContinuity(datasetId: string) {
    return request({
      baseURL: JOBPLUGIN_URL,
      url: `dqd/data-quality/domain/continuity`,
      method: "GET",
      params: { datasetId: datasetId },
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

  public getPluginUploadStatus() {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: "prefect/flow/default-deployment",
      method: "GET",
    });
  }

  public triggerPluginUpload() {
    return request({
      baseURL: DATAFLOW_MGMT_URL,
      url: "prefect/flow/default-deployment",
      method: "POST",
    });
  }
}
