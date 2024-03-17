import { FC, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOidcIdToken } from "@axa-fr/react-oidc";
import { EMPTY_USER_GROUP, useMsalInfo, UserClaims, useUserGroups } from "../../../contexts/UserContext";
import { api } from "../../../axios/api";
import { config } from "../../../config";
import env from "../../../env";

const subProp = env.REACT_APP_IDP_SUBJECT_PROP;

let firstTimeLoggedIn = false;
export const OidcLoginSilent: FC = () => {
  const navigate = useNavigate();
  const { claims, setClaims, setToken } = useMsalInfo();
  const { setUserGroups } = useUserGroups();
  const { idToken, idTokenPayload } = useOidcIdToken();

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
    async (res: { [prop: string]: string }) => {
      const userId = res[subProp];
      if (userId) {
        try {
          const userGroups = await api.userMgmt.getUserGroupList(userId);
          setUserGroups(userGroups);
        } catch (err: any) {
          console.error("Error when getting user info", err);
          navigate(err?.status === 403 ? config.ROUTES.noAccess : config.ROUTES.logout);
          setUserGroups(EMPTY_USER_GROUP);
        }
      }
    },
    [setUserGroups, navigate]
  );

  useEffect(() => {
    setupContext(idToken, idTokenPayload as UserClaims);
    if (!firstTimeLoggedIn) {
      firstTimeLoggedIn = true;
      loggedIn(idTokenPayload);
    }
  }, [idToken, idTokenPayload, loggedIn, setupContext]);

  return null;
};
