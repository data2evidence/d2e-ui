import React, { FC, useState, useCallback, useEffect } from "react";
import TermsOfUse from "../LegalPages/TermsOfUse";
import PrivacyPolicy from "../LegalPages/PrivacyPolicy";
import Imprint from "../LegalPages/Imprint";
import { Button, Card, Tab, Tabs, Title } from "@portal/components";
import { User } from "../../../types";
import { useMsalInfo } from "../../../contexts/UserContext";
import DeleteAccountDialog from "./DeleteAccountDialog/DeleteAccountDialog";
import { useDialogHelper } from "../../../hooks";
import env from "../../../env";
import "./Account.scss";

const legalTabs = ["Terms of use", "Privacy policy", "Imprint"];
const subProp = env.REACT_APP_IDP_SUBJECT_PROP;
const nameProp = env.REACT_APP_IDP_NAME_PROP;

const EMPTY_MY_USER: User = { id: "", name: "" };

export const Account: FC = () => {
  const { claims } = useMsalInfo();
  const [tabValue, setTabValue] = useState(0);
  const [myUser, setMyUser] = useState(EMPTY_MY_USER);
  const [showDeleteAccount, openDeleteAccount, closeDeleteAccount] = useDialogHelper(false);

  useEffect(() => {
    if (claims) {
      setMyUser({
        id: claims[subProp],
        name: claims[nameProp],
      });
    }
  }, [claims]);

  const handleTabSelectionChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  const renderTabContent = useCallback(() => {
    switch (tabValue) {
      case 0:
        return <TermsOfUse />;
      case 1:
        return <PrivacyPolicy />;
      case 2:
        return <Imprint />;
      default:
        return <TermsOfUse />;
    }
  }, [tabValue]);

  return (
    <div className="account">
      <div className="account__container">
        <div className="account__title">
          <Title>Account</Title>
        </div>
        <div className="account__content">
          <div className="account__content_account">
            <Card title="Account">
              <div className="account__content_account_details">
                <div>
                  <span>Name</span>
                  <span>{myUser?.name || "-"}</span>
                </div>
                <div>
                  <span>Email</span>
                  <span>{claims.email || "-"}</span>
                </div>
                <div>
                  <Button variant="secondary" text="Delete my account" onClick={openDeleteAccount} />
                </div>
              </div>
            </Card>
          </div>
          <div className="account__content_legal">
            <Card title="Legal">
              <div className="tab__container">
                <Tabs value={tabValue} onChange={handleTabSelectionChange} centered>
                  {legalTabs.map((tab, index) => (
                    <Tab
                      label={tab}
                      key={index}
                      value={index}
                      disableRipple
                      sx={{
                        "&.MuiTab-root": {
                          width: "200px",
                        },
                      }}
                    />
                  ))}
                </Tabs>
              </div>
              <div className="tab__content">
                <div className="tab__content__container">{renderTabContent()}</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <DeleteAccountDialog open={showDeleteAccount} onClose={closeDeleteAccount} />
    </div>
  );
};
