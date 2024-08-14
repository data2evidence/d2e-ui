import request from "./request";
import env from "../env";

const PERSEUS_BACKEND_BASE_URL = `${env.VITE_PERSEUS_BASE_URL}backend/api/`;

export class Backend {
  public getCDMVersions(): Promise<string[]> {
    return request({
      baseURL: PERSEUS_BACKEND_BASE_URL,
      url: "get_cdm_versions",
      method: "GET",
    });
  }

  public createSourceSchemaByScanReport(id: number, fileName: string) {
    return request({
      baseURL: PERSEUS_BACKEND_BASE_URL,
      url: `create_source_schema_by_scan_report`,
      method: "POST",
      data: {
        dataId: id,
        fileName,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
