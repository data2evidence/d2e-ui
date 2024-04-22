import React, { FC, useState, useEffect, useCallback } from "react";
import { Button } from "@portal/components";
import { useDialogHelper } from "../../../../hooks";
import JobDialog from "../JobDialog/JobDialog";
import { JobRunTypes } from "../types";
import "./JobRunButtons.scss";
import { api } from "../../../../axios/api";
import { MetaData } from "../../../../types";

interface JobRunButtonsProps {
  datasetId: string;
  studyName: string;
  handleGenerateJob: () => void;
}

const JobRunButtons: FC<JobRunButtonsProps> = ({ datasetId, studyName, handleGenerateJob }) => {
  const [showJobDialog, openJobDialog, closeJobDialog] = useDialogHelper(false);
  const [jobRunType, setJobRunType] = useState<JobRunTypes | null>(null);
  const [flowMetadata, setFlowMetadata] = useState<MetaData[]>([]);

  const getFlowMetadata = useCallback(async () => {
    try {
      const flowMetadata = await api.dataflow.getFlowMetadata();
      setFlowMetadata(flowMetadata);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleRunDQDClick = () => {
    setJobRunType(JobRunTypes.DQD);
    openJobDialog();
  };
  const handleRunDataCharacterizationClick = () => {
    setJobRunType(JobRunTypes.DataCharacterization);
    openJobDialog();
  };

  const isButtonDisabled = useCallback(
    (type?: string) => {
      if (type === JobRunTypes.DQD && studyName) {
        return !flowMetadata.some((flow) => flow.type === JobRunTypes.DQD.toLowerCase());
      }
      return !studyName;
    },
    [studyName, flowMetadata]
  );

  useEffect(() => {
    getFlowMetadata();
  }, [getFlowMetadata]);

  return (
    <>
      <div className="selector__button">
        <Button onClick={handleRunDQDClick} text="Run Data Quality" disabled={isButtonDisabled(JobRunTypes.DQD)} />
        <Button
          onClick={handleRunDataCharacterizationClick}
          text="Run Data Characterization"
          disabled={isButtonDisabled()}
        />
      </div>
      {jobRunType && (
        <JobDialog
          jobRunType={jobRunType}
          datasetId={datasetId}
          handleGenerateJob={handleGenerateJob}
          open={showJobDialog}
          onClose={closeJobDialog}
        />
      )}
    </>
  );
};

export default JobRunButtons;
