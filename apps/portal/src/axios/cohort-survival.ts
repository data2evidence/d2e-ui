import env from "../env";
import { CohortMapping } from "../types";
import request from "./request";

const MRI_BASE_URL = `${env.REACT_APP_DN_BASE_URL}analytics-svc`;

export class CohortSurvival {
  constructor(public studyId: string) {}

  public getCohorts(offset?: number, limit?: number): Promise<{ data: CohortMapping[] }> {
    return request({
      baseURL: MRI_BASE_URL,
      url: `/api/services/cohort`,
      method: "GET",
      params: { studyId: this.studyId, offset, limit },
    });
  }

  public startKmAnalysis(targetCohortId: number, outcomeCohortId: number): Promise<{ flowRunId: string }> {
    return request({
      baseURL: MRI_BASE_URL,
      url: `/api/services/kaplan-meier`,
      method: "POST",
      data: { targetCohortId, outcomeCohortId },
      params: { studyId: this.studyId },
    });
  }

  public getKmAnalysisResults(flowRunId: string): Promise<{ data: string }> {
    return request({
      baseURL: MRI_BASE_URL,
      url: `/api/services/kaplan-meier`,
      method: "GET",
      params: { studyId: this.studyId, flowRunId },
    });
  }
}
