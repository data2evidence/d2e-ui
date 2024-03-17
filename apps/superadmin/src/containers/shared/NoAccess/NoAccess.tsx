import React, { FC, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Loader } from "@portal/components";
import { config } from "../../../config";
import { useMsalInfo, SuperUserInfo } from "../../../contexts/MsalContext";
import "./NoAccess.scss";

const NoAccess: FC = () => {
  const { getSuperUserInfo } = useMsalInfo();
  const user: SuperUserInfo = getSuperUserInfo();
  const isAuthorized = user.isAlpAdmin || user.isAlpOwner;
  const navigate = useNavigate();
  const userId = user.id;

  useEffect(() => {
    if (isAuthorized && userId) {
      navigate("/");
    }
  }, [navigate, isAuthorized, userId]);

  const handleLogout = useCallback(() => {
    navigate(config.ROUTES.logout);
  }, [navigate]);

  if (userId === undefined) return <Loader />;

  return (
    <div className="no-access">
      <div className="no-access__title">Access denied.</div>
      <div className="no-access__description">Please check with your administrator to request access</div>
      <div className="no-access__actions">
        <Button text="Logout" onClick={handleLogout} block />
      </div>
    </div>
  );
};

export default NoAccess;
