import { request } from "./request";
import env from "../env";
import { TrexPlugin } from "../types";

const TREX_URL = `${env.REACT_APP_DN_BASE_URL}trex/`;

export class Trex {
  public getPlugins() {
    return request<TrexPlugin[]>({
      baseURL: TREX_URL,
      url: "plugins",
      method: "GET",
    });
  }

  public installPlugin(name: string) {
    return request<TrexPlugin>({
      baseURL: TREX_URL,
      url: `plugins/${name}`,
      method: "POST",
    });
  }

  public updatePlugin(name: string) {
    return request<TrexPlugin>({
      baseURL: TREX_URL,
      url: `plugins/${name}`,
      method: "PUT",
    });
  }

  public uninstallPlugin(name: string) {
    return request<{ message: string }>({
      baseURL: TREX_URL,
      url: `plugins/${name}`,
      method: "DELETE",
    });
  }
}
