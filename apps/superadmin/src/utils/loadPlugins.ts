import { IPlugin } from "../types";
import env from "../env";

export const loadPlugins = (): IPlugin => {
  let plugins: IPlugin = {
    researcher: [],
    admin: [],
    systemadmin: [],
    superadmin: [],
  };

  try {
    plugins = JSON.parse(env.REACT_APP_PLUGINS || JSON.stringify(plugins));
  } catch (err) {
    // ignore error
    console.log("Error when loading plugin config", err);
  }

  return plugins;
};
