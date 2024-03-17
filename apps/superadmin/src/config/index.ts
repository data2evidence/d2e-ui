interface Config {
  APP_TITLE: string;
  ROUTES: {
    login: string;
    logout: string;
    noAccess: string;
  };
}

export const config: Config = {
  APP_TITLE: "Research",
  ROUTES: {
    login: "/login",
    logout: "/logout",
    noAccess: "/no-access",
  },
};

export enum Roles {
  STUDY_RESEARCHER = "RESEARCHER",
  TENANT_VIEWER = "TENANT_VIEWER",
}

export const STUDY_ROLES: { [key: string]: string } = {
  [Roles.STUDY_RESEARCHER]: "Researcher",
};

export * from "./featureFlags";
