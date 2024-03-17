import React, { FC, useCallback, useState } from "react";
import { CloseDialogType, DatasetResource, Feedback } from "../../../../../types";
import Divider from "@mui/material/Divider";
import { Button, Dialog } from "@portal/components";
import { api } from "../../../../../axios/api";
import "./DatasetDeleteResourceDialog.scss";

interface DatasetDeleteResourceDialogProps {
  datasetId: string;
  resource: DatasetResource;
  open: boolean;
  onClose?: (type: CloseDialogType, resourceId?: string) => void;
}

const DatasetDeleteResourceDialog: FC<DatasetDeleteResourceDialogProps> = ({ datasetId, resource, open, onClose }) => {
  const [feedback, setFeedback] = useState<Feedback>({});
  const [loading, setLoading] = useState(false);

  const handleClose = useCallback(
    (type: CloseDialogType, filename?: string) => {
      setFeedback({});
      typeof onClose === "function" && onClose(type, filename);
    },
    [onClose, setFeedback]
  );

  const handleDelete = useCallback(async () => {
    if (!resource || !resource.name) return;

    setLoading(true);
    try {
      await api.systemPortal.deleteResource(datasetId, resource.name);
      handleClose("success", resource.name);
    } catch (error: any) {
      console.error(error);

      if (error.data?.message) {
        setFeedback({ type: "error", message: error.data.message });
      } else {
        setFeedback({
          type: "error",
          message: "An error has occurred.",
          description: "Please try again. To report the error, please send an email to help@data4life.care.",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [datasetId, resource, handleClose]);

  return (
    <Dialog
      className="dataset-delete-resource-dialog"
      title="Delete file"
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
      feedback={feedback}
    >
      <Divider />
      <div className="dataset-delete-resource-dialog__content">
        <div>Are you sure you want to delete the following file:</div>
        <strong>&quot;{resource.name}&quot;</strong>
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button text="Cancel" onClick={() => handleClose("cancelled")} variant="secondary" block disabled={loading} />
        <Button text="Delete" onClick={handleDelete} block loading={loading} />
      </div>
    </Dialog>
  );
};

export default DatasetDeleteResourceDialog;
