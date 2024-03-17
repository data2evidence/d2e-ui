import React, { FC, useEffect, useMemo, useState } from "react";
import { importPluginModule } from "./pluginLoader";
import { useUserInfo } from "../../contexts/UserContext";
import { getAuthToken } from "../../containers/auth";
import { PluginDropdownItem } from "@portal/plugin";

interface AdminPluginRendererProps {
  path: string;
  tenantId: string;
  studyId: string;
  fetchMenu: (route: string, menus: PluginDropdownItem[]) => void;
}

export const AdminPluginRenderer: FC<AdminPluginRendererProps> = ({ path, tenantId, studyId, fetchMenu }) => {
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
      tenantId,
      studyId,
      fetchMenu,
    }),
    [getUserId, tenantId, studyId, fetchMenu]
  );

  const PageComponent = component?.page;
  if (!PageComponent) return null;

  return <PageComponent metadata={metadata} />;
};
