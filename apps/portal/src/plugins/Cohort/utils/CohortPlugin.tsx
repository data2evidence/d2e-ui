import React, { FC, useState } from "react";
import { CohortMgmt } from "../../../axios/cohort-mgmt";
import CohortDefinitionList from "../components/CohortDefinitionList/CohortDefinitionList";
import CohortDeleteDialog from "../components/CohortDeleteDialog/CohortDeleteDialog";
import DataQualityDialog from "../components/DataQualityDialog/DataQualityDialog";
import { useDialogHelper, useFeedback } from "../../../hooks";

import { CohortMapping } from "../../../types/cohort";
import "./CohortPlugin.scss";
import { TranslationContext } from "../../../contexts/TranslationContext";

interface CohortPluginProps {
  userId: string;
  cohortMgmtClient: CohortMgmt;
  studyName?: string;
  schemaName?: string;
  databaseCode?: string;
}

const CohortPlugin: FC<CohortPluginProps> = ({ userId, cohortMgmtClient, studyName, schemaName, databaseCode }) => {
  const { getText, i18nKeys } = TranslationContext();
  const [activeCohort, setActiveCohort] = useState<CohortMapping>();
  const [refetch, setRefetch] = useState(false);
  const { setFeedback } = useFeedback();

  // Dialog show hooks
  const [showDeleteCohortDialog, openDeleteCohortDialog, closeDeleteCohortDialog] = useDialogHelper(false);
  const [showDataQualityDialog, openDataQualityDialog, closeDataQualityDialog] = useDialogHelper(false);

  return (
    <div className="cohort__container">
      <div className="cohort__container__header">{studyName}</div>
      <div className="cohort__container__title">{getText(i18nKeys.COHORT_PLUGIN__COHORT_MANAGEMENT)}</div>

      <div className="cohort__content">
        <div className="cohort__content__header">{getText(i18nKeys.COHORT_PLUGIN__COHORTS)}</div>
        {userId && (
          <CohortDefinitionList
            userId={userId}
            cohortMgmtClient={cohortMgmtClient}
            setActiveCohort={setActiveCohort}
            openDeleteCohortDialog={openDeleteCohortDialog}
            openDataQualityDialog={openDataQualityDialog}
            refetch={refetch}
            setRefetch={setRefetch}
          />
        )}
        {showDeleteCohortDialog && (
          <CohortDeleteDialog
            cohort={activeCohort}
            cohortMgmtClient={cohortMgmtClient}
            open={showDeleteCohortDialog}
            setMainFeedback={setFeedback}
            onClose={closeDeleteCohortDialog}
            setRefetch={setRefetch}
          />
        )}

        {showDataQualityDialog && activeCohort && schemaName && databaseCode && (
          <DataQualityDialog
            datasetId={cohortMgmtClient.studyId}
            cohort={activeCohort}
            open={showDataQualityDialog}
            onClose={closeDataQualityDialog}
          />
        )}
      </div>
    </div>
  );
};

export default CohortPlugin;
