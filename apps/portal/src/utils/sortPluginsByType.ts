import { Plugins } from "../types";

export const sortPluginsByType = (plugins: Plugins[]): Plugins[] => {
  const sortedPlugins = [] as Plugins[];
  const categories: any = [];

  plugins.forEach((item) => {
    if (item.type) {
      if (item.type === "hidden") {
        return;
      }
      if (!categories.some((el: Plugins) => el.name === item.type)) {
        if (item.menus) {
          categories.push({
            name: item.name,
            iconUrl: item.iconUrl,
            iconSize: item.iconSize,
            children: [...item.menus],
          });
        }
        categories.push({
          name: item.type,
          iconUrl: item.iconUrl,
          iconSize: item.iconSize,
          children: [item],
        });
        sortedPlugins.push(...categories);
      } else {
        const cat = categories.filter((el: any) => el.name === item.type);
        cat[0].children.push(item);
      }
    } else {
      sortedPlugins.push(item);
    }
  });

  return sortedPlugins;
};
