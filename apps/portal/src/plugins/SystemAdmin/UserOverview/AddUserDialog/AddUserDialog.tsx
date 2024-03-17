import React, { ChangeEvent, FC, useCallback, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Feedback,
  IconButton,
  Tooltip,
  VisibilityOffIcon,
  VisibilityOnIcon,
} from "@portal/components";
import { CloseDialogType } from "../../../../types";
import { api } from "../../../../axios/api";
import { generateRandom } from "../../../../utils";
import "./AddUserDialog.scss";

interface AddUserDialogProps {
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
}

interface FormData {
  username: string;
  password: string;
}

const EMPTY_FORM_DATA: FormData = { username: "", password: "" };

const AddUserDialog: FC<AddUserDialogProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({});
  const [passwordShown, setPasswordShown] = useState(false);

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFormData(EMPTY_FORM_DATA);
      setFeedback({});
      typeof onClose === "function" && onClose(type);
    },
    [onClose]
  );

  const handleAdd = useCallback(async () => {
    if (formData.username == null) return;

    try {
      setLoading(true);
      await api.userMgmt.addUser(formData.username, formData.password);
      handleClose("success");
    } catch (err: any) {
      if (err.data?.message) {
        setFeedback({ type: "error", message: err.data?.message });
      } else {
        setFeedback({
          type: "error",
          message: "An error has occurred.",
          description: "Please try again. To report the error, please send an email to help@data4life.care.",
        });
      }
      console.error("err", err);
    } finally {
      setLoading(false);
    }
  }, [formData, handleClose]);

  const handleTogglePassword = useCallback(() => {
    setPasswordShown((passwordShown) => !passwordShown);
  }, []);

  const handleGeneratePassword = useCallback(() => {
    setPasswordShown(true);
    setFormData((formData) => ({ ...formData, password: generateRandom(12) }));
  }, []);

  return (
    <Dialog
      className="add-user-dialog"
      title="Add user"
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
      feedback={feedback}
    >
      <Divider />
      <div className="add-user-dialog__content">
        <div className="u-padding-vertical--normal">
          <FormControl fullWidth>
            <TextField
              variant="standard"
              label="Username"
              value={formData.username}
              onChange={(event) => setFormData((formData) => ({ ...formData, username: event.target.value }))}
              helperText="Username should only contain letters, numbers, or underscore."
            />
          </FormControl>
        </div>
        <div className="u-padding-vertical--normal">
          <FormControl fullWidth>
            <Box display="flex" alignItems="flex-end">
              <TextField
                fullWidth
                type={passwordShown ? "text" : "password"}
                variant="standard"
                label="Password"
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
        <Button text="Cancel" onClick={() => handleClose("cancelled")} variant="secondary" block disabled={loading} />
        <Button text="Add" onClick={handleAdd} block loading={loading} />
      </div>
    </Dialog>
  );
};

export default AddUserDialog;
