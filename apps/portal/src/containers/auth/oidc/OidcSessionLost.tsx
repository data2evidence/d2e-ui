import React, { FC, useCallback } from "react";
import { Button } from "@portal/components";
import { oidcLogout } from "./oidc";
import "./OidcSessionLost.scss";

export const OidcSessionLost: FC = () => {
  const handleLogout = useCallback(async () => {
    localStorage.clear();
    oidcLogout();
  }, []);

  return (
    <div className="oidc-session-lost">
      <div className="oidc-session-lost__title">Session expired</div>
      <div className="oidc-session-lost__description">Your session has expired</div>
      <div className="oidc-session-lost__actions">
        <Button text="Logout" onClick={handleLogout} block />
      </div>
    </div>
  );
};
