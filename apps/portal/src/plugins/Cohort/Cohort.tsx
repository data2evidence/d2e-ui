import React, { FC } from "react";
import { PageProps, ResearcherStudyMetadata } from "@portal/plugin";
import CohortPlugin from "./utils/CohortPlugin";
import { CohortMgmt } from "../../axios/cohort-mgmt";
import { useDataset } from "../../hooks";
import "./Cohort.scss";
import { useTranslation } from "../../contexts";

interface CohortProps extends PageProps<ResearcherStudyMetadata> {}

export const Cohort: FC<CohortProps> = ({ metadata }: CohortProps) => {
  const { getText, i18nKeys } = useTranslation();

  const userId = metadata?.userId;

  if (!userId) {
    return <div>{getText(i18nKeys.COHORT__MISSING_USER_ID)}</div>;
  }

  return <CohortPlugin userId={userId} />;
};
