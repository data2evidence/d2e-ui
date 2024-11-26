import { request } from "../../../../axios/request";
import env from "../../../../env";
import { FilterOptions } from "../../../Researcher/Terminology/utils/types";

const TERMINOLOGY_BASE_URL = `${env.REACT_APP_DN_BASE_URL}terminology`;

export class Terminology {
  public async getAllFilterOptions(datasetId: string): Promise<{ filterOptions: FilterOptions }> {
    return request({
      baseURL: TERMINOLOGY_BASE_URL,
      method: "GET",
      url: `/concept/filter-options`,
      params: {
        datasetId: datasetId,
        searchText: "",
        filter: JSON.stringify({}),
      },
    });
  }
}
