import React, { FC, useCallback, useState } from "react";
import Divider from "@mui/material/Divider";
import { Button, Dialog, Feedback } from "@portal/components";
import { CloseDialogType, UserWithRolesInfoExt } from "../../../../types";
import { api } from "../../../../axios/api";
import "./DeleteUserDialog.scss";

interface DeleteUserDialogProps {
  user?: UserWithRolesInfoExt;
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
}

const DeleteUserDialog: FC<DeleteUserDialogProps> = ({ user, open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({});
  const userId = user?.userId;

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFeedback({});
      typeof onClose === "function" && onClose(type);
    },
    [onClose]
  );

  const handleDelete = useCallback(async () => {
    if (userId == null) return;

    try {
      setLoading(true);
      await api.userMgmt.deleteUser(userId);
      handleClose("success");
    } catch (err: any) {
      console.error("err", err);
      if (err?.data?.message) {
        setFeedback({ type: "error", message: err?.data?.message });
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
  }, [userId, handleClose]);

  return (
    <Dialog
      className="delete-user-dialog"
      title="Delete user"
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
      feedback={feedback}
    >
      <Divider />
      <div className="delete-user-dialog__content">
        <div>Are you sure you want to delete this account:</div>
        <div>{user?.username} ?</div>
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button text="Cancel" onClick={() => handleClose("cancelled")} variant="secondary" block disabled={loading} />
        <Button text="Yes, delete" onClick={handleDelete} block loading={loading} />
      </div>
    </Dialog>
  );
};

export default DeleteUserDialog;
