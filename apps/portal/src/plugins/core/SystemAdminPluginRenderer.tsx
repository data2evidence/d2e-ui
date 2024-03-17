import React, { FC, useEffect, useState } from "react";
import { importPluginModule } from "./pluginLoader";
import { useUserInfo } from "../../contexts/UserContext";
import { getAuthToken } from "../../containers/auth";

interface SystemAdminPluginRendererProps<T = any> {
  path: string;
  system: string;
  data: T;
}

export const SystemAdminPluginRenderer: FC<SystemAdminPluginRendererProps> = ({ path, system, data }) => {
  const { getUserId } = useUserInfo();
  const [component, setComponent] = useState<any>();

  useEffect(() => {
    if (!component) {
      const fetchPlugin = async () => {
        const plugin = await importPluginModule(path);
        setComponent(plugin);
      };
      fetchPlugin();
    }
  }, [component, path]);

  const PageComponent = component?.page;
  if (!PageComponent) return null;

  const metadata = {
    userId: getUserId(),
    system,
    getToken: async () => {
      return await getAuthToken();
    },
    data,
  };

  return <PageComponent metadata={metadata} />;
};
