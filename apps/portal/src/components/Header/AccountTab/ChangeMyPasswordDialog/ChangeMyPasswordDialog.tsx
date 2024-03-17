import React, { FC, useCallback, useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
  Tooltip,
  VisibilityOffIcon,
  VisibilityOnIcon,
} from "@portal/components";
import { Feedback } from "../../../../types";
import { generateRandom } from "../../../../utils";
import { api } from "../../../../axios/api";
import "./ChangeMyPassword.scss";

interface ChangeMyPasswordDialogProps {
  open: boolean;
  onClose?: () => void;
}

interface FormData {
  oldPassword: string;
  password: string;
}

const EMPTY_FORM_DATA: FormData = { oldPassword: "", password: "" };

export const ChangeMyPasswordDialog: FC<ChangeMyPasswordDialogProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({});

  useEffect(() => {
    setFormData(EMPTY_FORM_DATA);
    setFeedback({});
    setLoading(false);
  }, [open]);

  const handleClose = useCallback(() => {
    setFeedback({});
    typeof onClose === "function" && onClose();
  }, [onClose]);

  const handleTogglePassword = useCallback(() => {
    setPasswordShown((passwordShown) => !passwordShown);
  }, []);

  const handleGeneratePassword = useCallback(() => {
    setPasswordShown(true);
    setFormData((formData) => ({ ...formData, password: generateRandom(12) }));
  }, []);

  const handleUpdate = useCallback(async () => {
    try {
      setLoading(true);
      await api.userMgmt.changeMyPassword(formData.oldPassword, formData.password);
      setFeedback({
        type: "success",
        message: "Password updated",
      });
    } catch (err: any) {
      const message = err?.data?.message || err?.data?.error_description;
      if (message) {
        setFeedback({ type: "error", message });
      } else {
        console.log("There is an error in updating password", err);
        setFeedback({
          type: "error",
          message: "An error has occurred.",
          description: "Please try again. To report the error, please send an email to help@data4life.care.",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [formData.oldPassword, formData.password]);

  return (
    <Dialog
      className="change-my-password-dialog"
      title="Change password"
      closable
      open={open}
      onClose={handleClose}
      feedback={feedback}
    >
      <Divider />
      <div className="change-my-password-dialog__content">
        <div className="u-padding-vertical--normal">
          <FormControl fullWidth>
            <Box display="flex" alignItems="flex-end">
              <TextField
                fullWidth
                type="password"
                variant="standard"
                label="Old password"
                value={formData.oldPassword}
                onChange={(event) => setFormData((formData) => ({ ...formData, oldPassword: event.target.value }))}
              />
            </Box>
          </FormControl>
        </div>
        <div className="u-padding-vertical--normal">
          <FormControl fullWidth>
            <Box display="flex" alignItems="flex-end">
              <TextField
                fullWidth
                type={passwordShown ? "text" : "password"}
                variant="standard"
                label="New password"
                value={formData.password}
                onChange={(event) => setFormData((formData) => ({ ...formData, password: event.target.value }))}
              />
              <Tooltip title={passwordShown ? "Hide password" : "Show password"}>
                <IconButton
                  startIcon={passwordShown ? <VisibilityOffIcon /> : <VisibilityOnIcon />}
                  onClick={handleTogglePassword}
                />
              </Tooltip>
              <Button text="Generate" variant="tertiary" onClick={handleGeneratePassword} />
            </Box>
          </FormControl>
        </div>
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button text="Cancel" onClick={handleClose} variant="secondary" block disabled={loading} />
        <Button text="Update" onClick={handleUpdate} block loading={loading} />
      </div>
    </Dialog>
  );
};
