import React, { FC, useCallback, useState } from "react";
import Divider from "@mui/material/Divider";
import { Box, Button, Dialog } from "@portal/components";
import { api } from "../../../../axios/api";
import { useFeedback } from "../../../../contexts";
import { CloseDialogType, IDatabase } from "../../../../types";
import "./DeleteDbDialog.scss";

interface DeleteDbDialogProps {
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
  db: IDatabase;
}

export const DeleteDbDialog: FC<DeleteDbDialogProps> = ({ open, onClose, db }) => {
  const { setFeedback } = useFeedback();
  const [deleting, setDeletingn] = useState(false);

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      typeof onClose === "function" && onClose(type);
    },
    [onClose]
  );

  const handleDelete = useCallback(async () => {
    try {
      setDeletingn(true);
      await api.dbCredentialsMgr.deleteDb(db.id);
      setFeedback({
        type: "success",
        message: "Database deleted successfully",
        autoClose: 6000,
      });
      handleClose("success");
    } finally {
      setDeletingn(false);
    }
  }, [handleClose, db.id, setFeedback]);

  return (
    <Dialog
      className="delete-db-dialog"
      title="Delete database"
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
    >
      <Divider />
      <div className="delete-db-dialog__content">
        <div className="delete-db-dialog__content-text">
          Are you sure you want to delete the following <br />
          Database: <strong>&quot;{db.code}&quot;</strong>? <br />
        </div>
      </div>
      <div className="delete-db-dialog__footer">
        <Box display="flex" gap={1} className="delete-db-dialog__footer-actions">
          <Button text="Cancel" variant="secondary" onClick={() => handleClose("cancelled")} />
          <Button text="Delete" onClick={handleDelete} loading={deleting} />
        </Box>
      </div>
    </Dialog>
  );
};
