import React, { FC } from "react";
import { InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { getLoginRequest } from "./msal";

export const MsalRedirect: FC = () => {
  const loginRequest = getLoginRequest();

  return <MsalAuthenticationTemplate interactionType={InteractionType.Redirect} authenticationRequest={loginRequest} />;
};
