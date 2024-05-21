export const DB_DIALECTS = ["postgres", "hana"];
export type DbDialect = typeof DB_DIALECTS[number];

export interface IDatabase {
  id: string;
  code: string;
  host: string;
  port: number;
  name: string;
  dialect: DbDialect;
  extra: IDbExtra[];
  credentials: IDbCredential[];
  vocabSchemas: string[];
}

export interface IDbExtra {
  id?: string;
  value: string;
  serviceScope: ServiceScopeType;
}

export interface IDbCredential {
  id?: string;
  username: string;
  password: string;
  salt: string;
  userScope: UserScopeType;
  serviceScope: ServiceScopeType;
}

export enum USER_SCOPE_TYPES {
  ADMIN = "Admin",
  READ = "Read",
}
export const CREDENTIAL_USER_SCOPES = Object.values(USER_SCOPE_TYPES);

export type UserScopeType = `${USER_SCOPE_TYPES}`;

export enum SERVICE_SCOPE_TYPES {
  INTERNAL = "Internal",
  DATA_PLATFORM = "DataPlatform",
}

export const CREDENTIAL_SERVICE_SCOPES = [SERVICE_SCOPE_TYPES.INTERNAL]; //, SERVICE_SCOPE_TYPES.DATA_PLATFORM];

export type ServiceScopeType = `${SERVICE_SCOPE_TYPES}`;

export interface IDbExtraAdd extends Omit<IDbExtra, "id"> {}

export interface IDbCredentialAdd extends Omit<IDbCredential, "id"> {}

export interface INewDatabase extends Omit<IDatabase, "id" | "extra" | "credentials"> {
  extra: {
    Internal?: string;
    DataPlatform?: string;
  };
  credentials: IDbCredentialAdd[];
}

export interface IDatabaseCredentialsUpdate
  extends Omit<IDatabase, "code" | "host" | "port" | "name" | "dialect" | "extra" | "vocabSchemas"> {
  id: string;
  credentials: IDbCredentialAdd[];
}

export interface IDatabaseDetailsUpdate
  extends Omit<IDatabase, "code" | "host" | "port" | "name" | "dialect" | "extra" | "credentials"> {
  id: string;
  vocabSchemas: string[];
  extra: any;
}
