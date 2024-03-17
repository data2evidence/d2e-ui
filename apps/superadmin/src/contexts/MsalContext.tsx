import React, { FC, createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import env from "../env";

interface UserProviderProps {
  children?: ReactNode;
}

export interface MsalClaims {
  exp: number;
  oid: string;
  name: string;
  email: string;
  groups: string[];
}

export interface SuperUserInfo {
  id?: string;
  name?: string;
  email?: string;
  isAlpOwner: boolean;
  isAlpAdmin: boolean;
}

export const MsalContext = createContext<any>(null);

export function useMsalInfo() {
  const { claims, setClaims, getSuperUserInfo } = useContext(MsalContext);
  return { claims, setClaims, getSuperUserInfo };
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [claims, setClaims] = useState<MsalClaims>();
  const getSuperUserInfo = useCallback((): SuperUserInfo => {
    return {
      id: claims?.oid,
      name: claims?.name,
      email: claims?.email,
      isAlpOwner: claims?.groups.includes(env.REACT_APP_ALP_OWNER_GROUP_ID!) || false,
      isAlpAdmin: claims?.groups.includes(env.REACT_APP_SUPERADMIN_GROUP_ID!) || false,
    };
  }, [claims]);

  const providerValue = useMemo(() => ({ claims, setClaims, getSuperUserInfo }), [claims, setClaims, getSuperUserInfo]);
  return <MsalContext.Provider value={providerValue}>{children}</MsalContext.Provider>;
};
