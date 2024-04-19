import React, { FC } from "react";
import { PageProps, ResearcherStudyMetadata } from "@portal/plugin";
import CohortPlugin from "./utils/CohortPlugin";
import { CohortMgmt } from "../../axios/cohort-mgmt";
import { useDataset } from "../../hooks";
import "./Cohort.scss";
import { TranslationContext } from "../../contexts/TranslationContext";

interface CohortProps extends PageProps<ResearcherStudyMetadata> {}

export const Cohort: FC<CohortProps> = ({ metadata }: CohortProps) => {
  const { getText, i18nKeys } = TranslationContext();
  const studyId = metadata?.studyId;
  const userId = metadata?.userId;
  const [dataset] = useDataset(studyId || "");

  if (!userId || !studyId) {
    return <div>{getText(i18nKeys.COHORT__MISSING_USER_ID)}</div>;
  }

  // Initialize cohort management client object
  const cohortMgmtClient = new CohortMgmt(studyId);

  return (
    <CohortPlugin
      userId={userId}
      cohortMgmtClient={cohortMgmtClient}
      studyName={dataset?.studyDetail?.name}
      schemaName={dataset?.schemaName}
      databaseCode={dataset?.databaseCode}
    />
  );
};
