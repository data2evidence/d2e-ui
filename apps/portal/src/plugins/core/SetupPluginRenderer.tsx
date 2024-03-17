import React, { FC, useEffect, useMemo, useState } from "react";
import { importPluginModule } from "./pluginLoader";
import { useUserInfo } from "../../contexts/UserContext";
import { getAuthToken } from "../../containers/auth";

interface SetupPluginRendererProps<T = any> {
  path: string;
  data: T;
}

export const SetupPluginRenderer: FC<SetupPluginRendererProps> = ({ path, data }) => {
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

  const metadata = useMemo(
    () => ({
      userId: getUserId(),
      getToken: async () => {
        return await getAuthToken();
      },
      data,
    }),
    [getUserId, data]
  );

  const PageComponent = component?.page;
  if (!PageComponent) return null;

  return <PageComponent metadata={metadata} />;
};
