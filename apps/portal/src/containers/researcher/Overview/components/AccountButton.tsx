import React, { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@portal/components";
import { config } from "../../../../config";
import "./AccountButton.scss";

export const AccountButton: FC = () => {
  const navigate = useNavigate();

  const handleAccountClick = useCallback(() => {
    navigate(`${config.ROUTES.researcher}/account`);
  }, [navigate]);

  return <Button containerClassName="account-button" variant="outlined" text="Account" onClick={handleAccountClick} />;
};
