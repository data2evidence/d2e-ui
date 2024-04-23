import React, { FC, useEffect } from "react";
import { OidcProvider, useOidc } from "@axa-fr/react-oidc";
import { PublicApp } from "../../../apps/PublicApp";
import { PrivateApp } from "../../../apps/PrivateApp";
import { OidcAuthenticating } from "./OidcAuthenticating";
import { OidcError } from "./OidcError";
import { OidcCallbackSuccess } from "./OidcCallbackSuccess";
import { OidcSessionLost } from "./OidcSessionLost";
import env from "../../../env";
import { useLocation } from "react-router-dom";
import { PostLoginRedirectUrlContext } from "../../../contexts/PostLoginRedirectUrlContext";
import { isValidRedirectUrl } from "../../../utils";
import { AppProvider } from "../../../contexts";

let oidcConfig: any;
try {
  oidcConfig = JSON.parse(env.REACT_APP_IDP_OIDC_CONFIG.replaceAll("{window.location.origin}", window.location.origin));
} catch (err) {
  console.error(`Error when reading ${env.REACT_APP_IDP_OIDC_CONFIG}`);
}

const OidcAppInternal: FC = () => {
  const { isAuthenticated } = useOidc();
  const location = useLocation();
  const redirectUrl = localStorage.getItem("redirectUrl") || "";

  useEffect(() => {
    if (!redirectUrl && isValidRedirectUrl(location.pathname)) {
      localStorage.setItem("redirectUrl", location.pathname);
    }
  }, [location, redirectUrl]);

  if (!isAuthenticated) {
    return <PublicApp />;
  }

  return (
    <PostLoginRedirectUrlContext.Provider value={redirectUrl}>
      <PrivateApp />
    </PostLoginRedirectUrlContext.Provider>
  );
};

export const OidcApp: FC = () => {
  return (
    <OidcProvider
      configuration={oidcConfig}
      authenticatingComponent={OidcAuthenticating}
      authenticatingErrorComponent={OidcError}
      callbackSuccessComponent={OidcCallbackSuccess}
      sessionLostComponent={OidcSessionLost}
    >
      <AppProvider>
        <OidcAppInternal />
      </AppProvider>
    </OidcProvider>
  );
};
