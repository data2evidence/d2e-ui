import env from "../env";
import { StarboardNotebook } from "../plugins/Starboard/utils/notebook";
import request from "./request";

const STUDY_NOTEBOOK_BASE_URL = `${env.REACT_APP_DN_BASE_URL}system-portal/notebook`;

export class StudyNotebook {
  public getNotebookList(): Promise<StarboardNotebook[]> {
    const notebookList = request({
      baseURL: STUDY_NOTEBOOK_BASE_URL,
      url: ``,
      method: "GET",
    });
    return notebookList;
  }

  public createNotebook(name?: string, notebookContent?: string): Promise<StarboardNotebook> {
    return request({
      baseURL: STUDY_NOTEBOOK_BASE_URL,
      url: ``,
      data: { name, notebookContent },
      method: "POST",
    });
  }

  public saveNotebook(
    id: string,
    name: string,
    notebookContent: string,
    isShared: boolean
  ): Promise<StarboardNotebook> {
    return request({
      baseURL: STUDY_NOTEBOOK_BASE_URL,
      url: ``,
      data: {
        id,
        name,
        notebookContent,
        isShared,
      },
      method: "PUT",
    });
  }

  public deleteNotebook(id: string): Promise<boolean> {
    return request({
      baseURL: STUDY_NOTEBOOK_BASE_URL,
      url: `/${id}`,
      method: "DELETE",
    });
  }
}
