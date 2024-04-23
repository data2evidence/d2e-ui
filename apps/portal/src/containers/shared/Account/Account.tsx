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
import { useTranslation } from "../../../contexts";

const subProp = env.REACT_APP_IDP_SUBJECT_PROP;
const nameProp = env.REACT_APP_IDP_NAME_PROP;

const EMPTY_MY_USER: User = { id: "", name: "" };

export const Account: FC = () => {
  const { getText, i18nKeys } = useTranslation();
  const { claims } = useMsalInfo();
  const [tabValue, setTabValue] = useState(0);
  const [myUser, setMyUser] = useState(EMPTY_MY_USER);
  const [showDeleteAccount, openDeleteAccount, closeDeleteAccount] = useDialogHelper(false);

  const legalTabs = [
    getText(i18nKeys.ACCOUNT__TERMS_OF_USE),
    getText(i18nKeys.ACCOUNT__PRIVACY_POLICY),
    getText(i18nKeys.ACCOUNT__IMPRINT),
  ];

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
          <Title>{getText(i18nKeys.ACCOUNT__ACCOUNT)}</Title>
        </div>
        <div className="account__content">
          <div className="account__content_account">
            <Card title={getText(i18nKeys.ACCOUNT__ACCOUNT)}>
              <div className="account__content_account_details">
                <div>
                  <span>{getText(i18nKeys.ACCOUNT__NAME)}</span>
                  <span>{myUser?.name || "-"}</span>
                </div>
                <div>
                  <span>{getText(i18nKeys.ACCOUNT__EMAIL)}</span>
                  <span>{claims.email || "-"}</span>
                </div>
                <div>
                  <Button variant="secondary" text="Delete my account" onClick={openDeleteAccount} />
                </div>
              </div>
            </Card>
          </div>
          <div className="account__content_legal">
            <Card title={getText(i18nKeys.ACCOUNT__LEGAL)}>
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
