import React, { FC } from "react";
import { PageProps, SuperAdminPageMetadata } from "@portal/plugin";
import MRIComponent from "../utils/MRIComponent";

interface PatientAnalyticsConfigProps extends PageProps<SuperAdminPageMetadata> {}

export const PatientAnalyticsConfig: FC<PatientAnalyticsConfigProps> = ({ metadata }) => {
  const name = "hc.mri.pa.config.ui";
  return <MRIComponent key={name} componentName={name} getToken={metadata?.getToken} />;
};
