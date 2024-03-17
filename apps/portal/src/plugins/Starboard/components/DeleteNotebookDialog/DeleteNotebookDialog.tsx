import React, { FC, useCallback } from "react";
import { Button, Dialog } from "@portal/components";
import { StarboardNotebook } from "../../utils/notebook";
import { Divider } from "@mui/material";
import "./DeleteNotebookDialog.scss";

interface DeleteNotebookDialogProps {
  notebook?: StarboardNotebook;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteNotebookDialog: FC<DeleteNotebookDialogProps> = ({ notebook, open, onClose, onDelete }) => {
  const handleDelete = useCallback(() => {
    onDelete();
    onClose();
  }, [onDelete, onClose]);

  return (
    <Dialog className="delete-notebook-dialog" title="Delete notebook" closable open={open} onClose={onClose}>
      <Divider />
      <div className="delete-notebook-dialog__content">
        <div>Are you sure you want to delete the following notebook:</div>
        <div>
          {notebook?.name ? <strong>&quot;{notebook.name}&quot;</strong> : <strong>&quot;Untitled&quot;</strong>}?
        </div>
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button text="Cancel" onClick={onClose} variant="secondary" block />
        <Button text="Delete" onClick={handleDelete} block />
      </div>
    </Dialog>
  );
};

export default DeleteNotebookDialog;
