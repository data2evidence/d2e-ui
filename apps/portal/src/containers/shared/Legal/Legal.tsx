import React, { FC, useState, useCallback } from "react";
import LegalMenu from "./LegalMenu/LegalMenu";
import TermsOfUse from "../LegalPages/TermsOfUse";
import PrivacyPolicy from "../LegalPages/PrivacyPolicy";
import Imprint from "../LegalPages/Imprint";
import "./Legal.scss";

export const LegalTab = {
  TermsOfUse: "terms_of_use",
  PrivacyPolicy: "privacy_policy",
  Imprint: "imprint",
};

export const Legal: FC = () => {
  const [activeTab, setActiveTab] = useState(LegalTab.TermsOfUse);

  const handleTabChange = useCallback(
    (value: string): void => {
      setActiveTab(value);
    },
    [setActiveTab]
  );

  return (
    <div className="legal__container">
      <div className="legal__pages">
        <LegalMenu activeTab={activeTab} onClick={handleTabChange} />
      </div>
      <div className="legal__content">
        <div className="tab__content">
          {activeTab === LegalTab.TermsOfUse && (
            <div className="tab__content__container">
              <TermsOfUse type="public" />
            </div>
          )}

          {activeTab === LegalTab.PrivacyPolicy && (
            <div className="tab__content__container">
              <PrivacyPolicy type="public" />
            </div>
          )}

          {activeTab === LegalTab.Imprint && (
            <div className="tab__content__container">
              <Imprint type="public" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
