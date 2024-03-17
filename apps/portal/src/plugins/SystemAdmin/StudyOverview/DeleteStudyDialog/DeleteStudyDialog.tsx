import React, { FC, useCallback, useState } from "react";
import Divider from "@mui/material/Divider";
import { Button, Dialog } from "@portal/components";
import { api } from "../../../../axios/api";
import { Study, Feedback, CloseDialogType } from "../../../../types";
import "./DeleteStudyDialog.scss";

interface DeleteStudyDialogProps {
  study?: Study;
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
}

const DeleteStudyDialog: FC<DeleteStudyDialogProps> = ({ study, open, onClose }) => {
  const [feedback, setFeedback] = useState<Feedback>({});
  const [deleting, setDeleting] = useState(false);

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFeedback({});
      typeof onClose === "function" && onClose(type);
    },
    [onClose, setFeedback]
  );

  const handleDelete = useCallback(async () => {
    if (study == null) return;

    try {
      setDeleting(true);
      await api.systemPortal.deleteDataset(study.id);
      handleClose("success");
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: `Study ${study.id} failed to delete`,
        description: err.data?.message || err.data,
      });
      console.error("Error when deleting dataset", err);
    } finally {
      setDeleting(false);
    }
  }, [study, setFeedback, handleClose]);

  return (
    <Dialog
      className="delete-study-dialog"
      title="Delete dataset"
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
      feedback={feedback}
    >
      <Divider />
      <div className="delete-study-dialog__content">
        <div>Are you sure you want to delete this dataset:</div>
        <div>{study!.id} ?</div>
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button text="Cancel" onClick={() => handleClose("cancelled")} variant="secondary" block disabled={deleting} />
        <Button text="Yes, delete" onClick={handleDelete} block loading={deleting} />
      </div>
    </Dialog>
  );
};

export default DeleteStudyDialog;
