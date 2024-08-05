import request from "./request";

const WHITE_RABBIT_BASE_URL = "http://localhost:41180/backend/api/";

export class WhiteRabbit {
  public getCDMVersions() {
    return request({
      baseURL: WHITE_RABBIT_BASE_URL,
      url: "get_cdm_versions",
      method: "GET",
    });
  }
}
