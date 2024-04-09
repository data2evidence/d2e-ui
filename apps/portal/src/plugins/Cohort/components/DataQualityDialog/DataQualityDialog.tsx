import React, { FC, useCallback, useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import { Dialog, Loader, Button, SubTitle } from "@portal/components";
import { CohortMapping } from "../../../../types";
import { useDataQualityDatasetLatestCohortFlowRun } from "../../../../hooks/dataflow/useDataQualityDatasetLatestCohortFlowRun";
import DQDCombinedResults from "../../../../components/DQD/DQDCombinedResults/DQDCombinedResults";
import JobDialog from "../../../SystemAdmin/DQD/JobDialog/JobDialog";
import {
  FlowRunJobStateTypes,
  FlowRunInProgressJobStateTypes,
  FlowRunCancelledJobTypes,
  FlowRunFailedJobTypes,
  JobRunTypes,
} from "../../../SystemAdmin/DQD/types";
import { useDialogHelper } from "../../../../hooks";
import { useFeedback } from "../../../../contexts";
import { useUserInfo } from "../../../../contexts/UserContext";

import "./DataQualityDialog.scss";

interface DataQualityDialogProps {
  datasetId: string;
  cohort: CohortMapping;
  open: boolean;
  onClose?: () => void;
}

const DataQualityDialog: FC<DataQualityDialogProps> = ({ datasetId, cohort, open, onClose }) => {
  const [refetchLatestFlowRun, setRefetchLatestFlowRun] = useState(0);
  const [latestFlowRun, loadingLatestFlowRun, errorLatestFlowRun] = useDataQualityDatasetLatestCohortFlowRun(
    datasetId,
    cohort.id,
    refetchLatestFlowRun
  );
  const [showJobDialog, openJobDialog, closeJobDialog] = useDialogHelper(false);
  const { getFeedback } = useFeedback();
  const feedback = getFeedback();
  const { user: userInfo } = useUserInfo();

  useEffect(() => {
    if (!latestFlowRun) {
      return;
    }
    //   Refetch latest flow run if flow run is still "in progress"
    const interval = setInterval(() => {
      setRefetchLatestFlowRun((refetch) => refetch + 1);
    }, 10000);

    // Clear interval if latest flow run is completed or "failed"
    if (latestFlowRun.state.type === "COMPLETED" || FlowRunFailedJobTypes.includes(latestFlowRun.state.type)) {
      clearInterval(interval);
    }

    return (): void => clearInterval(interval);
  }, [latestFlowRun]);

  const renderDataQualityJobState = () => {
    // Flow has not completed succesfully
    if (FlowRunFailedJobTypes.includes(latestFlowRun.state.type)) {
      return <SubTitle>Latest job failed</SubTitle>;
    }

    if (FlowRunCancelledJobTypes.includes(latestFlowRun.state.type)) {
      return <SubTitle>Latest job cancelled</SubTitle>;
    }

    if (FlowRunInProgressJobStateTypes.includes(latestFlowRun.state.type)) {
      return <Loader text={`Latest Data Quality job is ${latestFlowRun.state.type}`} />;
    }

    if (FlowRunJobStateTypes.COMPLETED) {
      return <DQDCombinedResults flowRunId={latestFlowRun.id} />;
    }
  };

  const handleClose = useCallback(() => {
    typeof onClose === "function" && onClose();
  }, [onClose]);

  const handleGenerateJob = () => {
    setRefetchLatestFlowRun((refetch) => refetch + 1);
  };

  return (
    <Dialog
      className="results-dialog"
      title={`Data Quality results for Cohort: ${cohort.name}`}
      closable
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      feedback={feedback}
    >
      <Divider />
      <div className="results-dialog__content">
        <div className="results-dialog__button_container">
          <Button
            onClick={openJobDialog}
            text="Run Data Quality"
            disabled={FlowRunInProgressJobStateTypes.includes(latestFlowRun?.state?.type) || !userInfo.isSystemAdmin}
          ></Button>
        </div>
        <div>
          {loadingLatestFlowRun ? (
            <Loader text="Loading Data Quality Latest Flow Run" />
          ) : errorLatestFlowRun ? (
            <div>{errorLatestFlowRun.message}</div>
          ) : latestFlowRun ? (
            renderDataQualityJobState()
          ) : (
            <SubTitle>
              No Data Quality Job found for cohort, click Run Data Quality button to generate Data Quality results
            </SubTitle>
          )}
        </div>
        <JobDialog
          jobRunType={JobRunTypes.DQD}
          datasetId={datasetId}
          cohortDefinitionId={cohort.id.toString()}
          handleGenerateJob={handleGenerateJob}
          open={showJobDialog}
          onClose={closeJobDialog}
        />
      </div>
    </Dialog>
  );
};

export default DataQualityDialog;
