import env from "../env";
import axios from "axios";

const isDevMode = env.NODE_ENV === "development";
const BASE_URL = isDevMode
  ? `https://localhost:4000/portal/translations`
  : `${env.REACT_APP_DN_BASE_URL}portal/translations`;

// Translations are publicly accessible, hence interceptors for auth is not
// needed.
export class Translation {
  public async getTranslation(locale: string) {
    return await axios.get<{
      [key: string]: string;
    }>(`/${locale}.json`, { baseURL: BASE_URL });
  }
}
