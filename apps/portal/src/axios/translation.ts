import env from "../env";
import request from "./request";

const isDevMode = env.NODE_ENV === "development";
const BASE_URL = isDevMode
  ? `https://localhost:4000/portal/translations`
  : `${env.REACT_APP_DN_BASE_URL}portal/translations`;

export class Translation {
  public async getTranslation(locale: string): Promise<any> {
    return request({
      baseURL: BASE_URL,
      url: `/${locale}.json`,
      method: "GET",
    });
  }
}
