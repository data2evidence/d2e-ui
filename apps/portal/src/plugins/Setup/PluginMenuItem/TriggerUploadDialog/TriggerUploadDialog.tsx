import React, { FC, useCallback, useState } from "react";
import Divider from "@mui/material/Divider";
import { Button, Dialog, Feedback } from "@portal/components";
import { CloseDialogType } from "../../../../types";
import { api } from "../../../../axios/api";
import "./TriggerUploadDialog.scss";
import { useTranslation } from "../../../../contexts";
import { i18nKeys } from "../../../../contexts/app-context/states";

interface TriggerUploadDialogProps {
  open: boolean;
  uploadActive: boolean;
  onClose?: (type: CloseDialogType) => void;
}

const TriggerUploadDialog: FC<TriggerUploadDialogProps> = ({ open, uploadActive, onClose }) => {
  const { getText } = useTranslation();
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
  }, [handleClose, getText]);

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
          disabled={loading || uploadActive}
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
