import request from "./request";

const PERSEUS_BACKEND_BASE_URL = "http://localhost:41180/backend/api/";

export class Backend {
  public getCDMVersions() {
    return request({
      baseURL: PERSEUS_BACKEND_BASE_URL,
      url: "get_cdm_versions",
      method: "GET",
    });
  }
}
