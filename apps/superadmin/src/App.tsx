import React, { FC } from "react";
import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { ApolloProvider } from "@apollo/client";
import { getLoginRequest, msalSharedInstance } from "./msalInstance";
import { UserProvider } from "./contexts/MsalContext";
import { CreateApolloOptions, setupApollo } from "./apollo";
import { SharedPrivateApp } from "./apps/SharedPrivateApp";
import env from "./env";
import "./App.scss";

const apolloOptions: CreateApolloOptions = {
  scopes: ["openid", "email"],
};

const apolloClient = setupApollo(`${env.REACT_APP_CS_BASE_URL}portalsvc/graphql`, msalSharedInstance, apolloOptions);

const App: FC = () => {
  const loginRequest = getLoginRequest(["openid", "email"]);

  return (
    <ApolloProvider client={apolloClient}>
      <MsalProvider instance={msalSharedInstance}>
        <UserProvider>
          <MsalAuthenticationTemplate interactionType={InteractionType.Redirect} authenticationRequest={loginRequest}>
            <SharedPrivateApp />
          </MsalAuthenticationTemplate>
        </UserProvider>
      </MsalProvider>
    </ApolloProvider>
  );
};

export default App;
