import React, { FC, useCallback, useState } from "react";
import { Button, Dialog } from "@portal/components";
import TextField from "@mui/material/TextField";
import { CloseDialogType } from "../../../../types";
import { StarboardNotebook } from "../../utils/notebook";
import "./EditTitleDialog.scss";
import { Divider } from "@mui/material";

interface EditTitleDialogProps {
  title?: string;
  open: boolean;
  onClose: (type: CloseDialogType) => void;
  renameNotebook: (name: string) => Promise<void>;
  notebooks: StarboardNotebook[] | undefined;
}

export const EditTitleDialog: FC<EditTitleDialogProps> = ({ title, open, onClose, renameNotebook, notebooks }) => {
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [notebookTitle, setNotebookTitle] = useState(title);

  const handleNotebookChanges = (e: any) => {
    setNotebookTitle(e.target.value);
  };

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      typeof onClose === "function" && onClose(type);
    },
    [onClose]
  );

  const handleRename = useCallback(async () => {
    try {
      if (notebookTitle) {
        if (notebooks?.some((nb) => nb.name.toUpperCase() === notebookTitle.toUpperCase())) {
          setShowErrorMessage(true);
          return;
        }
        await renameNotebook(notebookTitle);
      }
      handleClose("success");
    } catch (err: any) {
      console.log(err);
      setShowErrorMessage(true);
    }
  }, [notebookTitle, renameNotebook, handleClose, notebooks]);

  return (
    <Dialog
      className="edit-title-dialog"
      closable
      title="Edit Notebook Title"
      open={open}
      onClose={() => handleClose("cancelled")}
    >
      <div className="edit-title-dialog__content">
        <TextField
          id="standard-helperText"
          label="Notebook Title"
          defaultValue={notebookTitle}
          variant="standard"
          onChange={handleNotebookChanges}
        />
        {showErrorMessage && (
          <div className="edit-title-dialog__content__error">
            The notebook title already exists. Please enter a different title.
          </div>
        )}
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button text="Cancel" onClick={() => handleClose("cancelled")} variant="secondary" block />
        <Button text="Save" onClick={handleRename} block />
      </div>
    </Dialog>
  );
};
