import React, { FC, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus, IPublicClientApplication, RedirectRequest } from "@azure/msal-browser";
import { getLoginRequest } from "../msalInstance";
import { MsalClaims, SuperUserInfo, useMsalInfo } from "../contexts/MsalContext";
import SuperAdmin from "../containers/superadmin/SuperAdmin";
import { config } from "../config";
import env from "../env";
import NoAccess from "../containers/shared/NoAccess/NoAccess";

export const SharedPrivateApp: FC = () => {
  const { claims, setClaims, getSuperUserInfo } = useMsalInfo();
  const [firstTimeLoggedIn, setFirstTimeLoggedIn] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const loginRequest = getLoginRequest();
  const { instance, inProgress } = useMsal();
  const accounts = instance.getAllAccounts();
  const navigate = useNavigate();

  useEffect(() => {
    const scopes = ["openid", "email"];
    const accessTokenRequest: RedirectRequest = {
      scopes,
      account: accounts[0],
    };
    const hasExpired = (newClaims: MsalClaims) => {
      if (claims && newClaims) {
        return claims.exp < newClaims.exp && claims.oid != newClaims.oid;
      }
      return true;
    };
    if (accounts && inProgress === InteractionStatus.None) {
      instance
        .acquireTokenSilent(accessTokenRequest)
        .then((accessTokenResponse) => {
          const newClaims = accessTokenResponse.idTokenClaims as MsalClaims;
          if (hasExpired(newClaims)) {
            setClaims(newClaims);
          }
          if (!firstTimeLoggedIn && accessTokenResponse.idToken) {
            setFirstTimeLoggedIn(true);
          }
        })
        .catch((error) => {
          console.log(error);
          instance.acquireTokenRedirect(loginRequest);
        });
    }
  }, [instance, accounts, inProgress, loginRequest, firstTimeLoggedIn, claims, setClaims, getSuperUserInfo]);

  const logoutHandler = async (instance: IPublicClientApplication) => {
    if (accounts.length > 0) {
      const logoutRequest = {
        account: instance.getAccountByHomeId(accounts[0].homeAccountId),
        postLogoutRedirectUri: env.REACT_APP_OAUTH_SHARED_AD_REDIRECT_URI,
      };
      await instance.logoutRedirect(logoutRequest);
    }
  };

  const Logout = () => {
    useEffect(() => {
      const logout = async () => {
        localStorage.clear();
        await logoutHandler(instance);
      };
      logout();
    }, []);

    return null;
  };

  useEffect(() => {
    const checkUserAuthorization = () => {
      const user: SuperUserInfo = getSuperUserInfo();
      if (user.isAlpAdmin || user.isAlpOwner) {
        return true;
      }
    };

    if (claims && checkUserAuthorization()) {
      setIsAuthorized(true);
    } else {
      navigate("/no-access");
    }
  }, [claims, getSuperUserInfo, navigate]);

  return (
    <div className="App">
      <Routes>
        {isAuthorized && <Route path="/*" element={<SuperAdmin />} />}
        <Route path={config.ROUTES.noAccess} element={<NoAccess />} />
        <Route path={config.ROUTES.logout} element={<Logout />} />
      </Routes>
    </div>
  );
};
