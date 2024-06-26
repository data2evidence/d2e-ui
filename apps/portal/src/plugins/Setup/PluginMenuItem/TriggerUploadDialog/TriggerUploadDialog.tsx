import React, { FC, useCallback, useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import { Button, Dialog, Feedback } from "@portal/components";
import { CloseDialogType } from "../../../../types";
import { api } from "../../../../axios/api";
import "./TriggerUploadDialog.scss";
import { useTranslation } from "../../../../contexts";
import { i18nKeys } from "../../../../contexts/app-context/states";

interface TriggerUploadDialogProps {
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
  onStatusUpdate: (status: string) => void;
}

const TriggerUploadDialog: FC<TriggerUploadDialogProps> = ({ open, onClose, onStatusUpdate }) => {
  const { getText } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({});
  const [uploadActive, setUploadActive] = useState(false);

  const fetchUploadStatus = useCallback(async () => {
    try {
      const res = await api.dataflow.getPluginUploadStatus();
      if (res.noActiveInstallations === false) {
        setUploadActive(true);
      } else {
        setUploadActive(false);
      }
      if (onStatusUpdate) {
        onStatusUpdate(res.installationStatus);
      }
    } catch (err) {
      console.error("Failed to fetch upload status", err);
    }
  }, [onStatusUpdate]);

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFeedback({});
      typeof onClose === "function" && onClose(type);
    },
    [onClose]
  );

  const handleUpload = useCallback(async () => {
    try {
      setLoading(true);
      await api.dataflow.triggerPluginUpload();
      fetchUploadStatus(); // Fetch status immediately after triggering upload
      handleClose("success");
    } catch (err: any) {
      console.error("err", err);
      if (err?.data?.message) {
        setFeedback({ type: "error", message: err?.data?.message });
      } else {
        setFeedback({
          type: "error",
          message: getText(i18nKeys.TRIGGER_PLUGIN_UPLOAD_DIALOG__ERROR),
          description: getText(i18nKeys.TRIGGER_PLUGIN_UPLOAD_DIALOG__DESCRIPTION),
        });
      }
    } finally {
      setLoading(false);
    }
  }, [handleClose, getText, fetchUploadStatus]);

  // Only activate interval if dialog is open
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (open) {
      fetchUploadStatus(); // Fetch status immediately when dialog opens
      intervalId = setInterval(fetchUploadStatus, 10000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [open, fetchUploadStatus]);

  return (
    <Dialog
      className="trigger-upload-dialog"
      title={getText(i18nKeys.TRIGGER_PLUGIN_UPLOAD_DIALOG__TITLE)}
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
      feedback={feedback}
    >
      <Divider />
      <div className="trigger-upload-dialog__content">
        <div>{getText(i18nKeys.TRIGGER_PLUGIN_UPLOAD_DIALOG__WARNING)}</div>
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button
          text={getText(i18nKeys.TRIGGER_PLUGIN_UPLOAD_DIALOG__CANCEL)}
          onClick={() => handleClose("cancelled")}
          variant="outlined"
          block
          disabled={loading}
        />
        <Button
          text={getText(i18nKeys.TRIGGER_PLUGIN_UPLOAD_DIALOG__CONFIRM)}
          onClick={handleUpload}
          block
          loading={loading || uploadActive}
        />
      </div>
    </Dialog>
  );
};

export default TriggerUploadDialog;
