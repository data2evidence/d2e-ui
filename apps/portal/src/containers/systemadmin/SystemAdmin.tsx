import React, { FC, useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Snackbar, ErrorBoundary } from "@portal/components";
import { Header } from "../../components";
import { useFeedback } from "../../contexts";
import { Plugins } from "../../types";
import { loadPlugins, sortPluginsByType, getPluginChildPath } from "../../utils";
import { SystemAdminPluginRenderer } from "../../plugins/core/SystemAdminPluginRenderer";
import { useSystemFeatures } from "../../hooks/useSystemFeatures";
import { Account } from "../shared/Account/Account";
import env from "../../env";
import "./SystemAdmin.scss";

const ROUTES = {
  account: "account",
  legal: "legal",
  logout: "/logout",
};

const NIFI_URL = `${env.REACT_APP_DN_BASE_URL}nifi/`;

const plugins = loadPlugins();
const releaseVersion = env.REACT_APP_ALP_RELEASE_VERSION;
const gitCommit = env.GIT_COMMIT;
const CURRENT_SYSTEM = env.REACT_APP_CURRENT_SYSTEM;

const SystemAdmin: FC = () => {
  const { clearFeedback, getFeedback } = useFeedback();
  const feedback = getFeedback();
  const [systemFeatures] = useSystemFeatures();
  /**
   * For Conditional Plugins
   */
  const pluginEnv: { [key: string]: boolean } = useMemo(
    () => ({
      nifi: !!NIFI_URL,
    }),
    []
  );

  const [systemAdminPlugins, setSystemAdminPlugins] = useState<Plugins[]>([]);

  const defaultRoute = useMemo(() => {
    const firstPlugin = systemAdminPlugins.at(0);
    return firstPlugin?.route || "";
  }, [systemAdminPlugins]);

  useEffect(() => {
    if (releaseVersion) {
      const shortRelVersion = releaseVersion.substring(0, releaseVersion.indexOf("-"));
      console.log(`Release version: ${shortRelVersion}`);
    }
    if (gitCommit) {
      console.log(`Git commit: ${gitCommit}`);
    }
  }, []);

  useEffect(() => {
    const updateSystemAdminPlugins = () => {
      const displayedSystemAdminPlugins = plugins.systemadmin.reduce<Plugins[]>((acc, item) => {
        const route = item.route;

        if (item.featureFlag) {
          pluginEnv[route] = systemFeatures.includes(item.featureFlag);
        }
        // Allows plugins not specified in pluginEnv to be shown by default
        // Allows plugins which are enabled based on pluginEnv
        if (!(route in pluginEnv) || pluginEnv[route]) {
          acc.push(item);
        }
        return acc;
      }, []);
      setSystemAdminPlugins(displayedSystemAdminPlugins);
    };
    updateSystemAdminPlugins();
  }, [pluginEnv, systemFeatures]);

  useEffect(() => {
    if ((feedback?.autoClose || 0) > 0) setTimeout(() => clearFeedback(), feedback?.autoClose);
  }, [feedback, clearFeedback]);

  const sortedPlugins = useMemo(() => sortPluginsByType(systemAdminPlugins), [systemAdminPlugins]);

  return (
    <div className="systemadmin__container">
      <Header portalType="systemadmin" systemAdminPlugins={sortedPlugins} />
      <main>
        <Snackbar
          type={feedback?.type}
          handleClose={clearFeedback}
          message={feedback?.message}
          description={feedback?.description}
          visible={feedback?.message != null}
        />
        <Routes>
          <Route path="/">
            <Route index element={<Navigate to={defaultRoute} />} />
            <Route path={ROUTES.account} element={<Account portalType="system_admin" />} />
            {systemAdminPlugins.map((item: Plugins) => (
              <Route
                key={item.name}
                path={getPluginChildPath(item)}
                element={
                  <ErrorBoundary name={item.name} key={item.route}>
                    <SystemAdminPluginRenderer
                      key={item.route}
                      path={item.pluginPath}
                      system={CURRENT_SYSTEM}
                      data={item?.data}
                    />
                  </ErrorBoundary>
                }
              />
            ))}
          </Route>
        </Routes>
      </main>
    </div>
  );
};

export default SystemAdmin;
