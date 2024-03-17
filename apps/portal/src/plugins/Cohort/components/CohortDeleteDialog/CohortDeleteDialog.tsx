import React, { FC, useCallback, useState } from "react";
import { Feedback } from "../../../../types";
import { CohortMapping } from "../../../../types/cohort";
import Divider from "@mui/material/Divider";
import { Button, Dialog } from "@portal/components";
import { Loader } from "@portal/components";
import { CohortMgmt } from "../../../../axios/cohort-mgmt";
import "./CohortDeleteDialog.scss";
interface CohortDeleteDialogProps {
  cohort?: CohortMapping;
  cohortMgmtClient: CohortMgmt;
  open: boolean;
  setMainFeedback: (feedback: Feedback) => void;
  onClose?: () => void;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const CohortDeleteDialog: FC<CohortDeleteDialogProps> = ({
  cohort,
  open,
  cohortMgmtClient,
  setMainFeedback,
  onClose,
  setRefetch,
}) => {
  const [feedback, setFeedback] = useState<Feedback>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = useCallback(() => {
    setFeedback({});
    typeof onClose === "function" && onClose();
  }, [onClose, setFeedback]);

  const handleDelete = useCallback(async () => {
    if (!cohort || !cohort.id) return;
    setIsLoading(true);
    try {
      await cohortMgmtClient.deleteCohort(cohort.id);
      setMainFeedback({
        type: "success",
        message: `Cohort deleted successfully.`,
        autoClose: 6000,
      });
      setRefetch(true);
      handleClose();
    } catch (err) {
      console.error("An error occured while deleting cohort");
      setFeedback({
        type: "error",
        message: "An error has occurred.",
        description: "Please try again. To report the error, please send an email to help@data4life.care.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [cohort, cohortMgmtClient, handleClose, setMainFeedback, setRefetch]);

  return (
    <Dialog
      className="delete-cohort-dialog"
      title="Delete Cohort"
      closable
      open={open}
      onClose={handleClose}
      feedback={feedback}
    >
      <Divider />
      <div className="delete-cohort-dialog__content">
        <div>Are you sure you want to delete the following cohort:</div>
        <div>
          Name: <strong>&quot;{cohort?.name}&quot;</strong>
          <br />
          Description: <strong>&quot;{cohort?.description}&quot;</strong>
        </div>
      </div>

      {isLoading && <Loader />}
      <Divider />
      <div className="button-group-actions">
        <Button text="Cancel" onClick={handleClose} variant="secondary" block disabled={isLoading} />
        <Button text="Yes, delete" onClick={handleDelete} block disabled={isLoading} />
      </div>
    </Dialog>
  );
};

export default CohortDeleteDialog;
