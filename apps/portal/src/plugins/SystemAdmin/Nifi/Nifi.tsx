import React, { FC } from "react";
import env from "../../../env";
import "./Nifi.scss";

const NIFI_URL = `${env.REACT_APP_DN_BASE_URL}nifi/`;

export const Nifi: FC = () => {
  return (
    <div className="nifi__container">
      <iframe title="Nifi" src={NIFI_URL} frameBorder="0" width="100%" height="100%" />
    </div>
  );
};
