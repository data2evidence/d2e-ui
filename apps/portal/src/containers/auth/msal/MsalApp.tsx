import React, { FC } from "react";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { msalInstance } from "./msal";
import { PrivateApp } from "../../../apps/PrivateApp";
import { PublicApp } from "../../../apps/PublicApp";

export const MsalApp: FC = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthenticatedTemplate>
        <PrivateApp />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <PublicApp />
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
};
