import React, { FC, useCallback, useState } from "react";
import Divider from "@mui/material/Divider";
import { Box, Button, Dialog } from "@portal/components";
import { api } from "../../../../../axios/api";
import { useFeedback } from "../../../../../hooks";
import { CloseDialogType } from "../../../../../types";
import { DatasetAttributeConfig } from "../../../../../types";
import "./DeleteAttributeDialog.scss";

interface DeleteAttributeDialogProps {
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
  attribute: DatasetAttributeConfig;
  setRefetch: React.Dispatch<React.SetStateAction<number>>;
}

export const DeleteAttributeDialog: FC<DeleteAttributeDialogProps> = ({ open, onClose, attribute, setRefetch }) => {
  const { setFeedback } = useFeedback();
  const [deleting, setDeleting] = useState(false);

  const attributeId = attribute.id;

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFeedback({});
      typeof onClose === "function" && onClose(type);
    },
    [onClose, setFeedback]
  );

  const handleDelete = useCallback(async () => {
    try {
      setDeleting(true);
      await api.systemPortal.deleteDatasetAttributeConfig(attributeId);
      setFeedback({
        type: "success",
        message: `Attribute Config deleted successfully.`,
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
  }, [handleClose, attributeId, setRefetch, setFeedback]);

  return (
    <Dialog
      className="delete-attribute-dialog"
      title="Delete Attribute"
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
    >
      <Divider />
      <div className="delete-attribute-dialog__content">
        <div className="delete-attribute-dialog__content-text">
          <div>
            Are you sure you want to delete the following <br />
            Attribute: <strong>&quot;{attributeId}&quot;</strong>? <br />
          </div>
        </div>
      </div>
      <div className="delete-attribute-dialog__footer">
        <Box display="flex" gap={1} className="delete-attribute-dialog__footer-actions">
          <Button text="Cancel" variant="secondary" onClick={() => handleClose("cancelled")} />
          <Button text="Delete" onClick={handleDelete} loading={deleting} />
        </Box>
      </div>
    </Dialog>
  );
};
