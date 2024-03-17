import { FC, useEffect } from "react";
import { useUserInfo } from "../../../contexts/UserContext";
import { oidcLogout } from "./oidc";

export const OidcLogout: FC = () => {
  const { clearUserContext } = useUserInfo();

  useEffect(() => {
    const logout = async () => {
      localStorage.clear();
      clearUserContext();
      await oidcLogout();
    };
    logout();
  }, [clearUserContext]);

  return null;
};
