import React, { FC, useEffect, useMemo, useState } from "react";
import { importPluginModule } from "./pluginLoader";
import { useUserInfo } from "../../contexts/UserContext";
import { getAuthToken } from "../../containers/auth";
import { PluginDropdownItem, SubFeatureFlags } from "@portal/plugin";

interface ResearcherStudyPluginRendererProps {
  path: string;
  tenantId: string;
  studyId: string;
  releaseId: string;
  data: any;
  fetchMenu: (route: string, menus: PluginDropdownItem[]) => void;
  subFeatureFlags: SubFeatureFlags;
}

export const ResearcherStudyPluginRenderer: FC<ResearcherStudyPluginRendererProps> = ({
  path,
  tenantId,
  studyId,
  releaseId,
  data,
  fetchMenu,
  subFeatureFlags,
}) => {
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
      releaseId,
      data,
      fetchMenu,
      subFeatureFlags,
    }),
    [tenantId, studyId, data, fetchMenu, getUserId, subFeatureFlags]
  );

  const PageComponent = component?.page;
  if (!PageComponent) return null;

  return <PageComponent metadata={metadata} />;
};
