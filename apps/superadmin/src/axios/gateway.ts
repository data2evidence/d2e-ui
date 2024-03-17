import { CopyStudyInput, NewStudyInput } from "../types";
import request from "./request";

export class Gateway {
  private readonly baseURL: string;

  constructor(baseURL: string | undefined) {
    this.baseURL = `https://${baseURL}/gateway/api`;
    if (!this.baseURL) {
      throw new Error("No baseURL is set for gateway API");
    }
  }

  public createDataset(input: NewStudyInput): Promise<any> {
    return request({
      baseURL: this.baseURL,
      url: `/dataset/create`,
      method: "POST",
      data: input,
    });
  }

  public copyDataset(input: CopyStudyInput): Promise<any> {
    return request({
      baseURL: this.baseURL,
      url: `/dataset/copy`,
      method: "POST",
      data: input,
    });
  }
}
