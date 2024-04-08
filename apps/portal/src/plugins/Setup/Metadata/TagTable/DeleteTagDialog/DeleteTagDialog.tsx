import React, { FC, useCallback, useState } from "react";
import Divider from "@mui/material/Divider";
import { Box, Button, Dialog } from "@portal/components";
import { api } from "../../../../../axios/api";
import { useFeedback } from "../../../../../contexts";
import { CloseDialogType } from "../../../../../types";
import "./DeleteTagDialog.scss";

interface DeleteTagDialogProps {
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
  name: string;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
}

export const DeleteTagDialog: FC<DeleteTagDialogProps> = ({ open, onClose, name, setRefetch }) => {
  const { setFeedback } = useFeedback();
  const [deleting, setDeleting] = useState(false);

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      typeof onClose === "function" && onClose(type);
    },
    [onClose]
  );

  const handleDelete = useCallback(async () => {
    try {
      setDeleting(true);
      await api.systemPortal.deleteDatasetTagConfig(name);
      setFeedback({
        type: "success",
        message: `Tag Config deleted successfully.`,
        autoClose: 6000,
      });
      setRefetch((refetch) => refetch + 1);
      handleClose("success");
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.data.error,
        description: err.data.message,
        autoClose: 6000,
      });
    } finally {
      setDeleting(false);
    }
  }, [handleClose, name, setRefetch, setFeedback]);

  return (
    <Dialog
      className="delete-tag-dialog"
      title="Delete Tag"
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
    >
      <Divider />
      <>
        <div className="delete-tag-dialog__content">
          <div className="delete-tag-dialog__content-text">
            <div>
              Are you sure you want to delete the following <br />
              Tag: <strong>&quot;{name}&quot;</strong>? <br />
            </div>
          </div>
        </div>
        <div className="delete-tag-dialog__footer">
          <Box display="flex" gap={1} className="delete-tag-dialog__footer-actions">
            <Button text="Cancel" variant="secondary" onClick={() => handleClose("cancelled")} />
            <Button text="Delete" onClick={handleDelete} loading={deleting} />
          </Box>
        </div>
      </>
    </Dialog>
  );
};
