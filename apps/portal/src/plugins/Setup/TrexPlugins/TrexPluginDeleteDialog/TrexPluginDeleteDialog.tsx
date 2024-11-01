import React, { ChangeEvent, FC, useCallback, useState } from "react";
import { Button, Dialog, TextInput } from "@portal/components";
import { Feedback, CloseDialogType, TrexPlugin } from "../../../../types";
import Divider from "@mui/material/Divider";
import FormHelperText from "@mui/material/FormHelperText";
import { api } from "../../../../axios/api";
import { useTranslation } from "../../../../contexts";
import "./TrexPluginDeleteDialog.scss";

interface TrexPluginDeleteDialogProps {
  plugin?: TrexPlugin;
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
}

const TrexPluginDeleteDialog: FC<TrexPluginDeleteDialogProps> = ({ plugin, open, onClose }) => {
  const { getText, i18nKeys } = useTranslation();
  const [feedback, setFeedback] = useState<Feedback>({});
  const [confirmationText, setConfirmationText] = useState("");
  const [confirmationError, setConfirmationError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFeedback({});
      setConfirmationText("");
      typeof onClose === "function" && onClose(type);
    },
    [onClose, setFeedback]
  );

  const isConfirmError = useCallback(() => {
    if (confirmationText !== plugin?.name) {
      setConfirmationError(true);
      return true;
    } else {
      setConfirmationError(false);
      return false;
    }
  }, [confirmationText, plugin]);

  const deletePlugin = useCallback(
    async (name: string) => {
      try {
        setLoading(true);
        await api.trex.deletePlugin(name);
      } catch (error: any) {
        console.log(error);
        setFeedback({
          type: "error",
          message: getText(i18nKeys.TREX_PLUGIN_DELETE_DIALOG__ERROR, [String(plugin?.name)]),
          description: error.data.message,
        });
      } finally {
        setLoading(false);
      }
    },
    [plugin, getText]
  );

  const handleDelete = useCallback(async () => {
    if (plugin == null) return;
    if (isConfirmError()) return;

    await deletePlugin(plugin.name);
    handleClose("success");
  }, [plugin, isConfirmError, deletePlugin, handleClose]);

  return (
    <Dialog
      className="trex-plugin-delete-dialog"
      title={getText(i18nKeys.TREX_PLUGIN_DELETE_DIALOG__DELETE)}
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
      feedback={feedback}
    >
      <Divider />
      <div className="trex-plugin-delete-dialog__content">
        <div className="trex-plugin-delete-dialog__content-text">
          <div>
            {getText(i18nKeys.TREX_PLUGIN_DELETE_DIALOG__CONFIRM_1)} <br />
            {getText(i18nKeys.TREX_PLUGIN_DELETE_DIALOG__CONFIRM_2)}: <strong>&quot;{plugin?.name}&quot;</strong>?{" "}
            <br />
          </div>
          <div>{getText(i18nKeys.TREX_PLUGIN_DELETE_DIALOG__CONFIRM_3)}</div>
        </div>
        <div className="trex-plugin-delete-dialog__content-input">
          <TextInput
            label={getText(i18nKeys.TREX_PLUGIN_DELETE_DIALOG__ENTER_FLOW_NAME)}
            value={confirmationText}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setConfirmationText(event.target.value)}
          />
          {confirmationError && (
            <FormHelperText>{getText(i18nKeys.TREX_PLUGIN_DELETE_DIALOG__ENTER_EXACT_FLOW_NAME)}</FormHelperText>
          )}
        </div>
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button
          text={getText(i18nKeys.TREX_PLUGIN_DELETE_DIALOG__CANCEL)}
          onClick={() => handleClose("cancelled")}
          variant="outlined"
          block
          disabled={loading}
        />
        <Button
          text={getText(i18nKeys.TREX_PLUGIN_DELETE_DIALOG__CONFIRM_DELETION)}
          onClick={handleDelete}
          block
          loading={loading}
        />
      </div>
    </Dialog>
  );
};

export default TrexPluginDeleteDialog;
