import React, { FC, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Header } from "../../components";
import { Snackbar } from "@portal/components";
import Configuration from "./Configuration/Configuration";
import Account from "./Account/Account";
import { useMsalInfo, SuperUserInfo } from "../../contexts/MsalContext";
import { useFeedback } from "../../hooks/useFeedback";
import { NavLink, Plugins } from "../../types";
import { loadPlugins } from "../../utils";
import env from "../../env";
import "./SuperAdmin.scss";

const plugins = loadPlugins();

const ROUTES = {
  config: "config",
  account: "account",
  logout: "/logout",
};

const isMSProject = env.REACT_APP_MS_PROJECT === "1";

/**
 * For Conditional Plugins
 */
export const pluginEnv: { [key: string]: boolean } = {};

const getSuperAdminPlugins = () => {
  const superadminPlugins = [] as Plugins[];

  plugins.superadmin.forEach((item: Plugins) => {
    const route = item.route as string;
    // Allows plugins not specified in pluginEnv to be shown by default
    if (!(route in pluginEnv)) {
      superadminPlugins.push(item);
    }
    // There is a check parameters
    if (pluginEnv[route]) {
      superadminPlugins.push(item);
    }
  });

  return superadminPlugins;
};
export const SuperAdminPlugins = getSuperAdminPlugins();

const SuperAdmin: FC = () => {
  const { getSuperUserInfo } = useMsalInfo();
  const user = getSuperUserInfo();
  const navigations = buildNavigations(user);
  const { clearFeedback, getFeedback } = useFeedback();
  const feedback = getFeedback();

  useEffect(() => {
    if ((feedback?.autoClose || 0) > 0) setTimeout(() => clearFeedback(), feedback?.autoClose);
  }, [feedback, clearFeedback]);

  return (
    <div className="superadmin__container">
      <Header nav={navigations} portalType="superadmin" />
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
            <Route index element={<Navigate to={ROUTES.config} />} />
            <Route path={ROUTES.config} element={<Configuration />} />
            <Route path={ROUTES.account} element={<Account />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
};

const buildNavigations = (user: SuperUserInfo) => {
  const navigations: NavLink[] = [{ id: "plugins", title: "Others", submenu: [], path: "" }];

  if (user.isAlpAdmin) {
    navigations.push({
      id: "configuration",
      path: ROUTES.config,
      title: "Configuration",
    });
  }

  if (!isMSProject) {
    navigations.push({
      id: "account",
      path: ROUTES.account,
      title: "Account",
    });
  }

  if (user.id) {
    navigations.push({
      id: "logout",
      path: ROUTES.logout,
      title: "Logout",
    });
  }

  return navigations;
};

export default SuperAdmin;
