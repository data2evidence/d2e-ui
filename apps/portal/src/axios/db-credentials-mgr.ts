import { request } from "./request";
import { DbDialect, IDatabase, IDatabaseCredentialsUpdate, INewDatabase, IDatabaseDetailsUpdate } from "../types";

const DB_CRED_MGR_BASE_URL = "db-credentials/";

export class DbCredentialsMgr {
  public getDbList(): Promise<IDatabase[]> {
    return request({
      baseURL: DB_CRED_MGR_BASE_URL,
      url: "db/list",
      method: "GET",
    });
  }

  public getDbVocabSchemas(dialect: DbDialect): Promise<{ [key: string]: string[] }> {
    return request({
      baseURL: DB_CRED_MGR_BASE_URL,
      url: `db/${dialect}/vocab-schema/list`,
      method: "GET",
    });
  }

  public addDb(db: INewDatabase) {
    return request({
      baseURL: DB_CRED_MGR_BASE_URL,
      url: "db",
      method: "POST",
      data: db,
    });
  }

  public updateDbCredentials(dbCredentials: IDatabaseCredentialsUpdate) {
    return request({
      baseURL: DB_CRED_MGR_BASE_URL,
      url: "db/credential",
      method: "PUT",
      data: dbCredentials,
    });
  }

  public updateDbDetails(db: IDatabaseDetailsUpdate) {
    return request({
      baseURL: DB_CRED_MGR_BASE_URL,
      url: "db",
      method: "PUT",
      data: db,
    });
  }

  public deleteDb(id: string) {
    return request({
      baseURL: DB_CRED_MGR_BASE_URL,
      url: `db/${id}`,
      method: "DELETE",
    });
  }

  public getVocabSchemas(dialect: DbDialect): Promise<string[]> {
    return request({
      baseURL: DB_CRED_MGR_BASE_URL,
      url: `vocab/${dialect}/schema/list`,
      method: "GET",
    });
  }
}
