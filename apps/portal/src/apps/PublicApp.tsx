import React, { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { setupApollo } from "../apollo";
import { config } from "../config";
import { Public } from "../containers/public/Public";
import { Login } from "../containers/auth/Login";
import { PublicRoot } from "../containers/public/PublicRoot";
import env from "../env";

const PublicAppInternal: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicRoot />} />
      <Route path={`${config.ROUTES.public}/*`} element={<Public />} />
      <Route path={config.ROUTES.login} element={<Login />} />
      <Route path="*" element={<Navigate to={config.ROUTES.login} />} />
    </Routes>
  );
};

const APOLLO_CLIENT_URI = `${env.REACT_APP_DN_BASE_URL}portalsvc/graphql`;
const publicApolloClient = setupApollo(APOLLO_CLIENT_URI.replace("graphql", "public-graphql"));

export const PublicApp: FC = () => {
  return (
    <ApolloProvider client={publicApolloClient}>
      <PublicAppInternal />
    </ApolloProvider>
  );
};
