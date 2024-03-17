import env from "../env";
import request from "./request";

const MRI_BASE_URL = `${env.REACT_APP_DN_BASE_URL}analytics-svc`;

export class CohortMgmt {
  constructor(public studyId: string) {}

  public getCohorts(offset?: number, limit?: number): Promise<any> {
    return request({
      baseURL: MRI_BASE_URL,
      url: `/api/services/cohort`,
      method: "GET",
      params: { studyId: this.studyId, offset, limit },
    });
  }

  public getFilteredCohorts(filterColumn: string, filterValue: string, offset?: number, limit?: number): Promise<any> {
    return request({
      baseURL: MRI_BASE_URL,
      url: `/api/services/cohort/${filterColumn}/${filterValue}`,
      method: "GET",
      params: { studyId: this.studyId, offset, limit },
    });
  }

  public deleteCohort(cohortDefinitionId: string): Promise<any> {
    return request({
      baseURL: MRI_BASE_URL,
      url: `/api/services/cohort?cohortId=${cohortDefinitionId}`,
      method: "DELETE",
      params: { studyId: this.studyId },
    });
  }
}
