import React, { FC, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserInfo, useUserGroups } from "../../../contexts/UserContext";
import { Button, Loader } from "@portal/components";
import { config } from "../../../config";
import "./NoAccess.scss";
import { TranslationContext } from "../../../contexts/TranslationContext";

const NoAccess: FC = () => {
  const { getText, i18nKeys } = TranslationContext();
  const { getUserId, user } = useUserInfo();
  const { userGroups } = useUserGroups();
  const isAuthorized = user?.canAccessResearcherPortal || user?.canAccessSystemAdminPortal;
  const navigate = useNavigate();
  const userId = getUserId();

  useEffect(() => {
    if (isAuthorized && userId) {
      navigate("/");
    }
  }, [navigate, isAuthorized, userId, userGroups]);

  const handleLogout = useCallback(() => {
    navigate(config.ROUTES.logout);
  }, [navigate]);

  if (userId === undefined || !userGroups) return <Loader />;

  return (
    <div className="no-access">
      <div className="no-access__title">{getText(i18nKeys.NO_ACCESS__ACCESS_DENIED)}</div>
      <div className="no-access__description">{getText(i18nKeys.NO_ACCESS__INFO)}</div>
      <div className="no-access__actions">
        <Button text="Logout" onClick={handleLogout} block />
      </div>
    </div>
  );
};

export default NoAccess;
