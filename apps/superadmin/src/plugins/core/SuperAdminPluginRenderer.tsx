import React, { FC, useEffect, useState } from "react";
import { importPluginModule } from "./pluginLoader";
import { getToken, msalSharedInstance } from "../../msalInstance";
import { useMsalInfo } from "../../contexts/MsalContext";

interface SuperAdminPluginRendererProps {
  path: string;
}

export const SuperAdminPluginRenderer: FC<SuperAdminPluginRendererProps> = ({ path }) => {
  const { getSuperUserInfo } = useMsalInfo();
  const user = getSuperUserInfo();
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
    userId: user.id,
    getToken: async () => {
      return await getToken(msalSharedInstance);
    },
  };

  return <PageComponent metadata={metadata} />;
};
