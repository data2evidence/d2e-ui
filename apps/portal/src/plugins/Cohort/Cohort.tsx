import React, { FC, useState } from "react";
import { PageProps, ResearcherStudyMetadata } from "@portal/plugin";
import { CohortMgmt } from "../../axios/cohort-mgmt";
import { useDialogHelper } from "../../hooks";
import { useTranslation, useFeedback, useActiveDataset } from "../../contexts";
import CohortDefinitionList from "./components/CohortDefinitionList/CohortDefinitionList";
import CohortDeleteDialog from "./components/CohortDeleteDialog/CohortDeleteDialog";
import DataQualityDialog from "./components/DataQualityDialog/DataQualityDialog";
import { CohortMapping } from "../../types/cohort";
import "./Cohort.scss";
interface CohortProps extends PageProps<ResearcherStudyMetadata> {}

export const Cohort: FC<CohortProps> = ({ metadata }: CohortProps) => {
  const { getText, i18nKeys } = useTranslation();
  const { activeDataset } = useActiveDataset();
  const [activeCohort, setActiveCohort] = useState<CohortMapping>();
  const [refetch, setRefetch] = useState(false);
  const { setFeedback } = useFeedback();

  const cohortMgmtClient = new CohortMgmt(activeDataset.id);
  const [showDeleteCohortDialog, openDeleteCohortDialog, closeDeleteCohortDialog] = useDialogHelper(false);
  const [showDataQualityDialog, openDataQualityDialog, closeDataQualityDialog] = useDialogHelper(false);

  const userId = metadata?.userId;

  if (!userId) {
    return <div>{getText(i18nKeys.COHORT__MISSING_USER_ID)}</div>;
  }

  return (
    <div className="cohort__container">
      <div className="cohort__content">
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

        {showDataQualityDialog && activeCohort && (
          <DataQualityDialog
            datasetId={activeDataset.id}
            cohort={activeCohort}
            open={showDataQualityDialog}
            onClose={closeDataQualityDialog}
          />
        )}
      </div>
    </div>
  );
};
