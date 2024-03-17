import React, { FC } from "react";
import { Card, ProfileIcon } from "@portal/components";
import { useMsalInfo } from "../../../contexts/MsalContext";
import "./Account.scss";

const Account: FC = () => {
  const { getSuperUserInfo } = useMsalInfo();
  const userToken = getSuperUserInfo();

  return (
    <div className="super-account__container" data-testid="account">
      <Card className="super-account__card" title="Account" icon={ProfileIcon}>
        <div className="super-account__content">
          <div className="super-account__field">
            <label>Name:</label>
            <div>{userToken?.name}</div>
          </div>
          <div className="super-account__field">
            <label>Email:</label>
            <div>{userToken.email}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Account;
