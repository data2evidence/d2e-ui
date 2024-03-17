import { PublicClientApplication, LogLevel, RedirectRequest } from "@azure/msal-browser";
import { LoginRequest } from "../../../types";
import env from "../../../env";

// The auth provider should be a singleton. Best practice is to only have it ever instantiated once.
// Avoid creating an instance inside the component it will be recreated on each render.
// If two providers are created on the same page it will cause authentication errors.
export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: env.REACT_APP_OAUTH_CLIENT_ID,
    authority: env.REACT_APP_OAUTH_AUTHORITY,
    postLogoutRedirectUri: env.REACT_APP_OAUTH_POST_LOGOUT_REDIRECT_URI,
    redirectUri: env.REACT_APP_OAUTH_REDIRECT_URI,
    navigateToLoginRequestUrl: false,
    knownAuthorities: [env.REACT_APP_B2C_DOMAIN_HOST],
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean): void => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
      piiLoggingEnabled: false,
    },
    windowHashTimeout: 60000,
    iframeHashTimeout: 6000,
    loadFrameTimeout: 0,
  },
});

export const msalLogout = async (): Promise<void> => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) {
    console.warn("No account for logging out");
    return;
  }

  const account = msalInstance.getAccountByHomeId(accounts[0].homeAccountId);
  const postLogoutRedirectUri = msalInstance.getConfiguration().auth.postLogoutRedirectUri;

  const logoutRequest = { account, postLogoutRedirectUri };
  await msalInstance.logoutRedirect(logoutRequest);
};

export const getMsalToken = async (redirect = true): Promise<string | void> => {
  const scopes = getScopes();
  const accounts = msalInstance.getAllAccounts();

  if (redirect && accounts.length === 0) {
    return msalInstance.loginRedirect({ scopes });
  }

  const tokenRequest: RedirectRequest = { scopes, account: accounts[0] };
  try {
    const response = await msalInstance.acquireTokenSilent(tokenRequest);
    return response.idToken.toString();
  } catch (err) {
    console.error("[getMsalToken]", err);
    if (redirect) {
      await msalLogout();
    }
  }
};

export const isMsalAuthenticated = () => {
  const isAuthenticated = msalInstance.getAllAccounts().length > 0;
  return isAuthenticated;
};

export const getScopes = (): string[] => {
  return [env.REACT_APP_OAUTH_CLIENT_ID, "email"];
};

export const getLoginRequest = (overrideScopes?: string[]): LoginRequest => {
  // if id_token_hint is present, user is trying to signup
  const scopes = overrideScopes || getScopes();
  const searchParms = new URLSearchParams(window.location.search);
  const extraQueryParameters = {
    id_token_hint: searchParms.get("id_token_hint") || "",
  };
  return { scopes, extraQueryParameters };
};
