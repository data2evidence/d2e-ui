import env from "../env";
import request from "./request";

const BASE_URL = `${env.REACT_APP_DN_BASE_URL}analytics-svc`;

export class Translation {
  public async getTranslation(locale: string): Promise<any> {
    return { greeting: "UNICORN" };
    // return request({
    //   baseURL: BASE_URL,
    //   url: `/api/services/cohort`,
    //   method: "GET",
    //   params: { studyId: this.studyId, offset, limit },
    // });
  }
}
