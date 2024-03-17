import env from "./env";
import { PublicClientApplication, LogLevel, RedirectRequest, AccountInfo } from "@azure/msal-browser";

// The auth provider should be a singleton. Best practice is to only have it ever instantiated once.
// Avoid creating an instance inside the component it will be recreated on each render.
// If two providers are created on the same page it will cause authentication errors.

export const msalSharedInstance = new PublicClientApplication({
  auth: {
    clientId: env.REACT_APP_OAUTH_SHARED_AD_CLIENT_ID,
    authority: env.REACT_APP_OAUTH_SHARED_AD_AUTHORITY,
    postLogoutRedirectUri: env.REACT_APP_OAUTH_SHARED_AD_POST_LOGOUT_REDIRECT_URI,
    redirectUri: env.REACT_APP_OAUTH_SHARED_AD_REDIRECT_URI,
    navigateToLoginRequestUrl: false,
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

export const logout = async (msal: PublicClientApplication, accounts: AccountInfo[]): Promise<void> => {
  if (accounts.length > 0) {
    const logoutRequest = {
      account: msal.getAccountByHomeId(accounts[0].homeAccountId),
      postLogoutRedirectUri: (<any>msal).config.auth.postLogoutRedirectUri,
    };
    await msal.logoutRedirect(logoutRequest);
  }
};

export const getToken = async (msal: PublicClientApplication): Promise<string | void> => {
  const scopes = getScopes();
  const accounts = await msal.getAllAccounts();

  if (accounts.length === 0) {
    return msal.loginRedirect({ scopes });
  }

  const tokenRequest: RedirectRequest = { scopes, account: accounts[0] };
  try {
    const response = await msal.acquireTokenSilent(tokenRequest);
    return response.idToken.toString();
  } catch (err) {
    console.error(`[getToken]: ${err}`);
    await logout(msal, accounts);
  }
};

export const getScopes = (): string[] => {
  return ["openid", "email"];
};

export const getLoginRequest = (
  overrideScopes?: string[]
): {
  scopes: string[];
  extraQueryParameters: { [q: string]: any };
} => {
  // if id_token_hint is present, user is trying to signup
  const scopes = overrideScopes || getScopes();
  const searchParms = new URLSearchParams(window.location.search);
  const extraQueryParameters = {
    id_token_hint: searchParms.get("id_token_hint") || "",
  };
  return { scopes, extraQueryParameters };
};
