import { Plugins } from "../types";

export const sortPluginsByType = (plugins: Plugins[]): Plugins[] => {
  const sortedPlugins = [] as Plugins[];
  const typeSet = new Set<string>();

  plugins.forEach((item) => {
    if (item.type) {
      if (item.type === "hidden") {
        return;
      }
      if (!typeSet.has(item.type)) {
        let newPlugin;
        if (item.menus) {
          newPlugin = {
            name: item.name,
            iconUrl: item.iconUrl,
            iconSize: item.iconSize,
            route: item.route,
            pluginPath: item.pluginPath,
            children: [...item.menus],
          };
        } else {
          newPlugin = {
            name: item.type,
            iconUrl: item.iconUrl,
            iconSize: item.iconSize,
            route: item.route,
            pluginPath: item.pluginPath,
            children: [item],
          };
        }
        typeSet.add(item.type);
        sortedPlugins.push(newPlugin);
      } else {
        const foundIndex = sortedPlugins.findIndex((plugin) => plugin.name === item.type);
        sortedPlugins[foundIndex].children?.push(item);
      }
    } else {
      sortedPlugins.push(item);
    }
  });

  return sortedPlugins;
};
