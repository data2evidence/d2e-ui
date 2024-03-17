import React, { FC } from "react";
import { default as MuiDialog, DialogProps as MuiDialogProps } from "@mui/material/Dialog";
import MuiIconButton from "@mui/material/IconButton";
import classNames from "classnames";
import { Snackbar } from "../Snackbar/Snackbar";
import { Feedback } from "../../types";
import { CloseIcon } from "../Icons";
import "./Dialog.scss";

export interface DialogProps extends MuiDialogProps {
  title?: string;
  closable?: boolean;
  open: boolean;
  feedback?: Feedback;
  onClose?: () => void;
  onCloseFeedback?: () => void;
}

export const Dialog: FC<DialogProps> = ({
  title,
  feedback,
  closable,
  onClose,
  onCloseFeedback,
  className,
  children,
  ...props
}) => {
  const classes = classNames("alp-dialog", { [`${className}`]: !!className });

  return (
    <MuiDialog
      className={classes}
      fullWidth={true}
      maxWidth="sm"
      onClose={onClose}
      PaperProps={{
        style: { borderRadius: 32 },
      }}
      data-testid="dialog"
      {...props}
    >
      <div className="alp-dialog__title">
        <div className="alp-dialog__title-text" data-testid="dialog-title">
          {title}
        </div>
        {closable && (
          <MuiIconButton onClick={onClose} aria-label="close" data-testid="dialog-close">
            <CloseIcon />
          </MuiIconButton>
        )}
      </div>
      {feedback && feedback.message && (
        <div className="alp-dialog__snackbar">
          <Snackbar
            type={feedback.type}
            message={feedback.message}
            description={feedback.description}
            visible={feedback.message != null}
            handleClose={onCloseFeedback}
          />
        </div>
      )}
      {children}
    </MuiDialog>
  );
};
