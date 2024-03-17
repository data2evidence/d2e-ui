import React, { FC, useCallback, useState, useEffect } from "react";
import { Button, Dialog, Loader } from "@portal/components";
import Divider from "@mui/material/Divider";
import { UsefulEvent } from "../../../../types";
import webComponentWrapper from "../../../../webcomponents/webComponentWrapper";
import ReleaseSelector from "../ReleaseSelector/ReleaseSelector";
import { JobRunTypes } from "../types";
import { api } from "../../../../axios/api";
import { useDatasets, useFeedback } from "../../../../hooks";
import "./JobDialog.scss";

interface JobDialogProps {
  jobRunType: string;
  datasetId: string;
  cohortDefinitionId?: string;
  handleGenerateJob: () => void;
  open: boolean;
  onClose?: () => void;
}

const JobDialog: FC<JobDialogProps> = ({
  jobRunType,
  datasetId,
  cohortDefinitionId,
  handleGenerateJob,
  open,
  onClose,
}) => {
  const studies = useDatasets("systemAdmin")[0];
  // Set title based on jobRunType
  const title = jobRunType === JobRunTypes.DQD ? "Generate Data Quality" : "Generate Data Characterization";
  const [isLoading, setIsLoading] = useState(false);
  const [releaseId, setReleaseId] = useState("");
  const [comment, setComment] = useState("");
  const { setFeedback } = useFeedback();

  const runJob = async () => {
    setIsLoading(true);
    const vocabSchemaName = studies.find((s) => s.id === datasetId)?.vocabSchemaName || "";

    const data = { comment, datasetId, vocabSchemaName, releaseId, cohortDefinitionId };

    try {
      if (jobRunType === JobRunTypes.DQD) {
        await api.dataflow.createFlowRunByMetadata({
          type: JobRunTypes.DQD.toLowerCase(),
          options: data,
        });
      }
      if (jobRunType === JobRunTypes.DataCharacterization) {
        await api.dataflow.generateDataCharacterizationFlowRun(data);
      }
      setFeedback({
        type: "success",
        message: `${jobRunType} job successfully started.`,
        autoClose: 6000,
      });
      handleGenerateJob();
      setComment("");
      setReleaseId("");
    } catch {
      setFeedback({
        type: "error",
        message: `An error has occurred when trying to create a ${jobRunType} Job`,
        description: "Please try again. To report the error, please send an email to help@data4life.care.",
        autoClose: 6000,
      });
    }
    setIsLoading(false);
    handleClose();
  };

  const handleClose = useCallback(() => {
    typeof onClose === "function" && onClose();
  }, [onClose]);

  const handleReleaseSelect = (releaseId: string) => {
    setReleaseId(releaseId);
  };

  return (
    <Dialog className="job-dialog" title={title} closable open={open} onClose={handleClose} maxWidth="xl">
      <Divider />
      <div className="job-dialog__content">
        <ReleaseSelector datasetId={datasetId} handleReleaseSelect={handleReleaseSelect} />
        <div className="job-dialog__edit-input u-padding-vertical--normal">
          {/* @ts-ignore */}
          <d4l-input
            value={comment}
            label="Comment"
            required
            // @ts-ignore
            ref={webComponentWrapper({
              handleInput: (event: UsefulEvent) => {
                setComment(event.target.value);
              },
            })}
          />
        </div>
      </div>
      <Divider />
      <div className="button-group-actions">
        {isLoading ? (
          <Loader text="Generating Job" />
        ) : (
          <>
            <Button text="Generate" onClick={runJob} block disabled={isLoading} />
            <Button text="Cancel" onClick={handleClose} variant="secondary" block />
          </>
        )}
      </div>
    </Dialog>
  );
};

export default JobDialog;
