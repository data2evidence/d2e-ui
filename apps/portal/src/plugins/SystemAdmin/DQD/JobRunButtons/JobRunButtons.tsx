import React, { FC, useState, useEffect } from "react";
import { Button } from "@portal/components";
import { useDialogHelper } from "../../../../hooks";
import JobDialog from "../JobDialog/JobDialog";
import { JobRunTypes } from "../types";
import "./JobRunButtons.scss";

interface JobRunButtonsProps {
  datasetId: string;
  studyName: string;
  handleGenerateJob: () => void;
}

const JobRunButtons: FC<JobRunButtonsProps> = ({ datasetId, studyName, handleGenerateJob }) => {
  const [showJobDialog, openJobDialog, closeJobDialog] = useDialogHelper(false);
  const [jobRunType, setJobRunType] = useState<JobRunTypes | null>(null);

  const handleRunDQDClick = () => {
    setJobRunType(JobRunTypes.DQD);
    openJobDialog();
  };
  const handleRunDataCharacterizationClick = () => {
    setJobRunType(JobRunTypes.DataCharacterization);
    openJobDialog();
  };

  // If studyName is empty, disable buttons
  const isButtonDisabled = !studyName;
  return (
    <>
      <div className="selector__button">
        <Button onClick={handleRunDQDClick} text="Run Data Quality" disabled={isButtonDisabled} />
        <Button
          onClick={handleRunDataCharacterizationClick}
          text="Run Data Characterization"
          disabled={isButtonDisabled}
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
