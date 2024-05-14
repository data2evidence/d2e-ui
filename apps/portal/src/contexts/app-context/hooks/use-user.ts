import { useCallback, useContext } from "react";
import { AppContext, AppDispatchContext } from "../AppContext";
import { ACTION_TYPES } from "../reducer";
import { UserGroupMetadata, UserState } from "../states";

export const useUser = () => {
  const { user } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);

  const setUserGroup = useCallback((idpUserId: string, userGroupMetadata: UserGroupMetadata) => {
    const user = mapUserGroupToUser(idpUserId, userGroupMetadata);
    dispatch({ type: ACTION_TYPES.SET_USER, payload: user });
  }, []);

  const clearUser = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_USER });
  }, []);

  return { userId: user.userId, user, setUserGroup, clearUser };
};

const mapUserGroupToUser = (idpUserId: string, userGroupMetadata: UserGroupMetadata): UserState => {
  const isSystemAdmin = Boolean(userGroupMetadata.alp_role_system_admin);
  const isUserAdmin = Boolean(userGroupMetadata.alp_role_user_admin);
  const isDashboardViewer = Boolean(userGroupMetadata.alp_role_dashboard_viewer);
  const isTenantViewer = (userGroupMetadata.alp_role_tenant_viewer?.length || 0) > 0;
  const isDatasetResearcher = (userGroupMetadata.alp_role_study_researcher?.length || 0) > 0;
  const isStudyManager = (userGroupMetadata.alp_role_study_mgr?.length || 0) > 0;
  const isResearcher = isStudyManager || isDatasetResearcher;

  const canAccessSystemAdminPortal =
    Boolean(userGroupMetadata.alp_role_system_admin) || Boolean(userGroupMetadata.alp_role_user_admin);
  const canAccessResearcherPortal = isResearcher || isTenantViewer;

  return {
    userId: userGroupMetadata.userId,
    idpUserId,
    canAccessSystemAdminPortal,
    canAccessResearcherPortal,
    isResearcher,
    isUserAdmin,
    isSystemAdmin,
    isDashboardViewer,
    researcherDatasetIds: userGroupMetadata.alp_role_study_researcher,
    isDatasetResearcher: (studyId: string) => userGroupMetadata.alp_role_study_researcher?.includes(studyId) || false,
  };
};
