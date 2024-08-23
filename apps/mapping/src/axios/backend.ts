import request from "./request";
import { TableSchemaState } from "../contexts";
import { pluginMetadata } from "../App";

const PERSEUS_BACKEND_BASE_URL = `${pluginMetadata?.data?.dnBaseUrl}backend/api/`;

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

  public getCDMSchema(cdmVersion: string) {
    return request<TableSchemaState[]>({
      baseURL: PERSEUS_BACKEND_BASE_URL,
      url: `get_cdm_schema`,
      method: "GET",
      params: { cdm_version: cdmVersion },
    });
  }
}
