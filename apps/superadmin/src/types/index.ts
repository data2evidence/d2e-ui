export * from "./study";
export * from "./user";
export * from "./systemApp";
export * from "./tenant";
export * from "./system";

export interface NavLink {
  id: string;
  path: string;
  title: string;
  subpaths?: string[];
  submenu?: NavLink[];
}

export interface Plugins {
  iconUrl?: string;
  iconSize?: number;
  name: string;
  route: string;
  pluginPath: string;
  type?: string;
  children?: Plugins[];
}

export interface IPluginItem {
  name: string;
  route: string;
  pluginPath: string;
  featureFlag?: string;
  iconUrl?: string;
  iconSize?: number;
  enabled?: boolean;
  requiredRoles?: string[];
  type?: string;
  proxySource?: string;
  proxyDestination?: string;
  proxyTarget?: string;
  proxyTimeout?: number;
  subFeatureFlags?: string[];
}

export interface IPlugin {
  researcher: IPluginItem[];
  admin: IPluginItem[];
  systemadmin: IPluginItem[];
  superadmin: IPluginItem[];
}

export type UsefulEvent = Event & {
  detail: number;
  target: {
    dataset: {
      to: string;
    };
    label: string;
    name: string;
    value: string;
    type: string;
    checked: boolean;
    className: string;
    tagName: string;
  };
};

export interface DeleteMutationResponse {
  code: string;
  id: string;
  success: boolean;
  message?: string;
}

export interface Feedback {
  type?: "error" | "success";
  message?: string;
  description?: string;
  autoClose?: number;
}

export type CloseDialogType = "success" | "cancelled";
