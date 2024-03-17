import React from "react";
import ReactDOM from "react-dom";
import builtInPlugins from "../builtInPlugins";

//@ts-ignore
import SystemJS from "systemjs/dist/system-production";

function exposeToPlugin(name: string, component: any) {
  SystemJS.registerDynamic(name, [], true, (require: any, exports: any, module: { exports: any }) => {
    module.exports = component;
  });
}

exposeToPlugin("react", React);
exposeToPlugin("react-dom", ReactDOM);

const moduleCache: { [key: string]: any } = {};

export const importPluginModule = (url: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const builtIn = builtInPlugins[url];
    if (typeof builtIn === "function") {
      const module = await builtIn();
      resolve(module.plugin);
      return;
    }

    const cached = moduleCache[url];
    if (cached) {
      resolve(cached);
      return;
    }

    SystemJS.import(url)
      .then((pluginModule: any) => {
        if (pluginModule.plugin) {
          moduleCache[url] = pluginModule.plugin;
          resolve(pluginModule.plugin);
        } else {
          reject("Missing export: plugin");
        }
      })
      .catch((err: any) => {
        console.warn("Error loading plugin: ", module, err);
      });
  });
};
