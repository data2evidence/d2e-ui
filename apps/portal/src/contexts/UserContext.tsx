import React, { FC, createContext, ReactNode, useMemo, useState, useContext, useCallback, useEffect } from "react";
import env from "../env";

const subProp = env.REACT_APP_IDP_SUBJECT_PROP;

interface UserProviderProps {
  children?: ReactNode;
}

export interface UserClaims {
  exp: number;
  sub: string;
  oid?: string;
  name: string;
  email: string;

  [prop: string]: any;
}

type RoleTypeOf<T, Boolean> = {
  ALP_USER_ADMIN: Boolean;
  ALP_SYSTEM_ADMIN: Boolean;
  ALP_NIFI_ADMIN: Boolean;
  ALP_DASHBOARD_VIEWER: Boolean;
  TENANT_VIEWER: T;
  STUDY_MANAGER: T;
  STUDY_RESEARCHER: T;
};

type AlpTenantUserRoleMapType = RoleTypeOf<string[], boolean>;

export interface UserGroupMetadata {
  userId: string | null;
  groups: string[];
  alpRoleMap: AlpTenantUserRoleMapType;
  alp_tenant_id: string[]; // list of all tenant ids
  alp_role_study_researcher: string[]; // list of study ids
  alp_role_study_mgr: string[]; // list of study ids
  alp_role_tenant_viewer: string[]; // list of tenant ids
  alp_role_user_admin: boolean; // alp user admin
  alp_role_system_admin: boolean; // alp system admin
  alp_role_nifi_admin: boolean; // alp nifi admin
  alp_role_dashboard_viewer: boolean; // dashboard viewer
}

export interface UserInfo {
  userId?: string | null;
  idpUserId?: string;
  tenantId: string[];
  canAccessSystemAdminPortal: boolean;
  canAccessResearcherPortal: boolean;
  isResearcher: boolean;
  isUserAdmin: boolean;
  isSystemAdmin: boolean;
  isDashboardViewer: boolean;
  isStudyResearcher: (studyId: string) => boolean;
  isStudyManager: (studyId: string) => boolean;
}

const initialUserInfo = {
  tenantId: [],
  canAccessSystemAdminPortal: false,
  canAccessResearcherPortal: false,
  isResearcher: false,
  isUserAdmin: false,
  isSystemAdmin: false,
  isDashboardViewer: false,
  isStudyResearcher: () => false,
  isStudyManager: () => false,
};

export const EMPTY_USER_GROUP: UserGroupMetadata = {
  userId: null,
  groups: [],
  alpRoleMap: {
    ALP_USER_ADMIN: false,
    ALP_SYSTEM_ADMIN: false,
    ALP_NIFI_ADMIN: false,
    ALP_DASHBOARD_VIEWER: false,
    TENANT_VIEWER: [],
    STUDY_MANAGER: [],
    STUDY_RESEARCHER: [],
  },
  alp_tenant_id: [],
  alp_role_study_researcher: [],
  alp_role_study_mgr: [],
  alp_role_tenant_viewer: [],
  alp_role_user_admin: false,
  alp_role_system_admin: false,
  alp_role_nifi_admin: false,
  alp_role_dashboard_viewer: false,
};

export const MsalContext = createContext<any>(null);
export const GroupContext = createContext<any>(null);
export const UserContext = createContext<any>(null);

export function useMsalInfo() {
  const { token, setToken, claims, setClaims } = useContext(MsalContext);
  return { token, setToken, claims, setClaims };
}

export function useUserGroups(): {
  userGroups: UserGroupMetadata | undefined;
  setUserGroups: React.Dispatch<React.SetStateAction<UserGroupMetadata>>;
} {
  const { userGroups, setUserGroups } = useContext(GroupContext);
  return { userGroups, setUserGroups };
}

export function useUserInfo(): {
  getUserId: () => string;
  user: UserInfo;
  clearUserContext: () => void;
} {
  const { getUserId, user, clearUserContext } = useContext(UserContext);
  return { getUserId, user, clearUserContext };
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string>();
  const [claims, setClaims] = useState<UserClaims>();
  const [userGroups, setUserGroups] = useState<UserGroupMetadata>();
  const [user, setUser] = useState<UserInfo>();

  const getUserId = useCallback((): string | undefined | null => {
    return userGroups?.userId;
  }, [userGroups]);

  const getIdpUserId = useCallback((): string | undefined => {
    if (claims) {
      if (!(subProp in claims)) {
        throw new Error(`"${subProp}" is not found in token`);
      }

      return claims[subProp];
    }
    return undefined;
  }, [claims]);

  const updateUser = useCallback((): void => {
    const idpUserId = getIdpUserId();
    if (!userGroups) {
      setUser({
        idpUserId,
        ...initialUserInfo,
      });
      return;
    }

    const isSystemAdmin = Boolean(userGroups.alp_role_system_admin);
    const isUserAdmin = Boolean(userGroups.alp_role_user_admin);
    const isDashboardViewer = Boolean(userGroups.alp_role_dashboard_viewer);
    const isTenantViewer = (userGroups.alp_role_tenant_viewer?.length || 0) > 0;
    const isStudyResearcher = (userGroups.alp_role_study_researcher?.length || 0) > 0;
    const isStudyManager = (userGroups.alp_role_study_mgr?.length || 0) > 0;
    const isResearcher = isStudyManager || isStudyResearcher;

    const canAccessSystemAdminPortal =
      Boolean(userGroups.alp_role_system_admin) || Boolean(userGroups.alp_role_user_admin);
    const canAccessResearcherPortal = isResearcher || isTenantViewer;
    setUser({
      idpUserId,
      userId: userGroups.userId,
      tenantId: userGroups.alp_tenant_id,
      canAccessSystemAdminPortal,
      canAccessResearcherPortal,
      isResearcher,
      isUserAdmin,
      isSystemAdmin,
      isDashboardViewer,
      isStudyResearcher: (studyId: string) => userGroups.alp_role_study_researcher?.includes(studyId) || false,
      isStudyManager: (studyId: string) => userGroups.alp_role_study_mgr?.includes(studyId) || false,
    });
  }, [userGroups, getIdpUserId, setUser]);

  useEffect(() => {
    updateUser();
  }, [updateUser]);

  const clearUserContext = useCallback((): void => {
    setClaims(undefined);
    setToken(undefined);
  }, [setClaims, setToken]);

  const msalProviderValue = useMemo(
    () => ({ token, setToken, claims, setClaims }),
    [token, setToken, claims, setClaims]
  );
  const groupsProviderValue = useMemo(() => ({ userGroups, setUserGroups }), [userGroups, setUserGroups]);
  const userProviderValue = useMemo(() => ({ getUserId, user, clearUserContext }), [getUserId, user, clearUserContext]);
  return (
    <MsalContext.Provider value={msalProviderValue}>
      <GroupContext.Provider value={groupsProviderValue}>
        <UserContext.Provider value={userProviderValue}>{children}</UserContext.Provider>
      </GroupContext.Provider>
    </MsalContext.Provider>
  );
};
