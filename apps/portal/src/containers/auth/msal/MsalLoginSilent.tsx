import { FC, useCallback, useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, RedirectRequest, AuthenticationResult } from "@azure/msal-browser";
import { getLoginRequest, getScopes } from "./msal";
import { EMPTY_USER_GROUP, useMsalInfo, UserClaims, useUserGroups } from "../../../contexts/UserContext";
import { api } from "../../../axios/api";

export const MsalLoginSilent: FC = () => {
  const { claims, setClaims, setToken } = useMsalInfo();
  const { setUserGroups } = useUserGroups();
  const [firstTimeLoggedIn, setFirstTimeLoggedIn] = useState(false);

  const loginRequest = getLoginRequest();
  const { instance, inProgress } = useMsal();
  const scopes = getScopes();
  const accounts = instance.getAllAccounts();

  const hasExpired = useCallback(
    (newClaims: UserClaims) => {
      if (claims && newClaims) {
        return claims.exp < newClaims.exp && claims.sub != newClaims.sub;
      }
      return true;
    },
    [claims]
  );

  const setupContext = useCallback(
    (token: string, newClaims: UserClaims) => {
      setToken(token);
      if (hasExpired(newClaims)) {
        setClaims(newClaims);
      }
    },
    [hasExpired, setToken, setClaims]
  );

  const loggedIn = useCallback(
    async (res: AuthenticationResult) => {
      const userId = (res.idTokenClaims as any)?.sub;

      if (userId) {
        try {
          const userGroups = await api.userMgmt.getUserGroupList(userId);
          setUserGroups(userGroups);
        } catch (err) {
          console.error("Error when getting user info", err);
          setUserGroups(EMPTY_USER_GROUP);
        }
      }
    },
    [setUserGroups]
  );

  useEffect(() => {
    const accessTokenRequest: RedirectRequest = {
      scopes,
      account: accounts[0],
    };
    if (accounts && inProgress === InteractionStatus.None) {
      instance
        .acquireTokenSilent(accessTokenRequest)
        .then((res) => {
          if (res.idToken) {
            setupContext(res.idToken, res.idTokenClaims as UserClaims);
            setFirstTimeLoggedIn((firstTimeLoggedIn) => {
              if (!firstTimeLoggedIn) {
                loggedIn(res);
              }
              return true;
            });
          }
        })
        .catch((error) => {
          console.log(error);
          instance.acquireTokenRedirect(loginRequest);
        });
    }
  }, [instance, accounts, inProgress, scopes, loginRequest, loggedIn, setupContext]);

  return null;
};
