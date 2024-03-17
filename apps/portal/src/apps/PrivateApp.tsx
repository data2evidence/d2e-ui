import React, { FC, useContext, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { useUserInfo, UserProvider } from "../contexts/UserContext";
import { PostLoginRedirectUrlContext } from "../contexts/PostLoginRedirectUrlContext";
import { setupApollo } from "../apollo";
import { Researcher } from "../containers/researcher/Researcher";
import SystemAdmin from "../containers/systemadmin/SystemAdmin";
import NoAccess from "../containers/shared/NoAccess/NoAccess";
import { Logout } from "../containers/auth/Logout";
import { LoginSilent } from "../containers/auth/LoginSilent";
import { Dashboard } from "../containers/dashboard/Dashboard";
import { config } from "../config";
import env from "../env";
import { TerminologyWithEventListener } from "../plugins/SystemAdmin/Terminology/TerminologyWithEventListener";
import { ResultsDialogWithEventLister } from "../plugins/SystemAdmin/DQD/ResultsDialog/ResultsDialogWithEventListener";

const PrivateAppInternal: FC = () => {
  const redirectUrl = useContext(PostLoginRedirectUrlContext);
  const { user } = useUserInfo();

  const defaultRoute = useMemo(() => {
    let defaultRoute = config.ROUTES.researcher;

    if (!user) {
      defaultRoute = config.ROUTES.login;
    } else if (redirectUrl) {
      defaultRoute = redirectUrl;
    } else if (user.canAccessSystemAdminPortal && !user.isResearcher) {
      defaultRoute = config.ROUTES.systemadmin;
    } else if (!user.canAccessResearcherPortal && !user.canAccessSystemAdminPortal) {
      defaultRoute = config.ROUTES.noAccess;
    }

    return defaultRoute;
  }, [user, redirectUrl]);

  return (
    <div className="App">
      <TerminologyWithEventListener />
      <ResultsDialogWithEventLister />
      <LoginSilent />
      <Routes>
        {user?.canAccessSystemAdminPortal && (
          <Route path={`${config.ROUTES.systemadmin}/*`} element={<SystemAdmin />} />
        )}
        {user?.canAccessResearcherPortal && <Route path={`${config.ROUTES.researcher}/*`} element={<Researcher />} />}
        <Route path={config.ROUTES.logout} element={<Logout />} />
        <Route path={config.ROUTES.noAccess} element={<NoAccess />} />
        <Route path={config.ROUTES.dashboard} element={<Dashboard />} />
        <Route path="/" element={<Navigate to={defaultRoute} />}>
          <Route path="public" element={<Navigate to={defaultRoute} />} />
          <Route path="login" element={<Navigate to={defaultRoute} />} />
          <Route path="dashboard" element={<Navigate to={defaultRoute} />} />
        </Route>
      </Routes>
    </div>
  );
};

const APOLLO_CLIENT_URI = `${env.REACT_APP_DN_BASE_URL}portalsvc/graphql`;
const apolloClient = setupApollo(APOLLO_CLIENT_URI);

export const PrivateApp: FC = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
        <PrivateAppInternal />
      </UserProvider>
    </ApolloProvider>
  );
};
