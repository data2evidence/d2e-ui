import React, { FC, useCallback, useState } from "react";
import Divider from "@mui/material/Divider";
import { Button, Dialog, Feedback } from "@portal/components";
import { CloseDialogType } from "../../../../types";
import { api } from "../../../../axios/api";
import "./TriggerUploadDialog.scss";
import { useTranslation } from "../../../../contexts";

interface TriggerUploadDialogProps {
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
}

const TriggerUploadDialog: FC<TriggerUploadDialogProps> = ({ open, onClose }) => {
  const { getText, i18nKeys } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({});

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
      // await api.dataflow.getPluginUploadStatus();
      handleClose("success");
    } catch (err: any) {
      console.error("err", err);
      if (err?.data?.message) {
        setFeedback({ type: "error", message: err?.data?.message });
      } else {
        setFeedback({
          type: "error",
          message: getText(i18nKeys.DELETE_USER_DIALOG__ERROR),
          description: getText(i18nKeys.DELETE_USER_DIALOG__DESCRIPTION),
        });
      }
    } finally {
      setLoading(false);
    }
  }, [handleClose, getText]);

  return (
    <Dialog
      className="trigger-upload-dialog"
      title={getText(i18nKeys.SETUP_PLUGIN_UPLOAD__TITLE)}
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
      feedback={feedback}
    >
      <Divider />
      <div className="trigger-upload-dialog__content">
        <div>{getText(i18nKeys.SETUP_PLUGIN_UPLOAD__WARNING)}</div>
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button
          text={getText(i18nKeys.SETUP_PLUGIN_UPLOAD__CANCEL)}
          onClick={() => handleClose("cancelled")}
          variant="outlined"
          block
          disabled={loading}
        />
        <Button text={getText(i18nKeys.SETUP_PLUGIN_UPLOAD__CONFIRM)} onClick={handleUpload} block loading={loading} />
      </div>
    </Dialog>
  );
};

export default TriggerUploadDialog;
