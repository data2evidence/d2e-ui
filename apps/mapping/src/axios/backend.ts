import request from "./request";

const BACKEND_BASE_URL = "http://localhost:41180/backend/api/";

export class Backend {
  public getCDMVersions() {
    return request({
      baseURL: BACKEND_BASE_URL,
      url: "get_cdm_versions",
      method: "GET",
    });
  }

  public createSourceSchemaByScanReport(
    id: number,
    fileName: string,
    cdmVersion: string
  ) {
    return request({
      baseURL: BACKEND_BASE_URL,
      url: `create_source_schema_by_scan_report`,
      method: "POST",
      data: {
        dataId: id,
        fileName,
        cdmVersion,
      },
    });
  }
}
