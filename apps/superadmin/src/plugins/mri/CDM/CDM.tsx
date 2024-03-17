import React, { FC } from "react";
import { PageProps, SuperAdminPageMetadata } from "@portal/plugin";
import MRIComponent from "../utils/MRIComponent";

interface CDMProps extends PageProps<SuperAdminPageMetadata> {}

export const CDM: FC<CDMProps> = ({ metadata }) => {
  const name = "hc.hph.cdw.config.ui";
  return <MRIComponent key={name} componentName={name} getToken={metadata?.getToken} />;
};
