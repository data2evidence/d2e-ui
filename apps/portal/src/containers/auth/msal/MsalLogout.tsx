import { FC, useCallback, useEffect } from "react";
import { IPublicClientApplication } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { useUserInfo } from "../../../contexts/UserContext";
import env from "../../../env";

export const MsalLogout: FC = () => {
  const { clearUserContext } = useUserInfo();
  const { instance } = useMsal();
  const accounts = instance.getAllAccounts();

  const logoutHandler = useCallback(
    async (instance: IPublicClientApplication) => {
      if (accounts.length > 0) {
        const logoutRequest = {
          account: instance.getAccountByHomeId(accounts[0].homeAccountId),
          postLogoutRedirectUri: env.REACT_APP_OAUTH_REDIRECT_URI,
        };
        await instance.logoutRedirect(logoutRequest);
      }
    },
    [accounts]
  );

  useEffect(() => {
    const logout = async () => {
      localStorage.clear();
      clearUserContext();
      await logoutHandler(instance);
    };
    logout();
  }, [instance, clearUserContext, logoutHandler]);

  return null;
};
