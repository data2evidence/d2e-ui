import React, { FC } from "react";
import { PageProps, SuperAdminPageMetadata } from "@portal/plugin";
import MRIComponent from "../utils/MRIComponent";

interface AssignmentProps extends PageProps<SuperAdminPageMetadata> {}

export const Assignment: FC<AssignmentProps> = ({ metadata }) => {
  const name = "hc.hph.config.assignment.ui";
  return <MRIComponent key={name} componentName={name} getToken={metadata?.getToken} />;
};
