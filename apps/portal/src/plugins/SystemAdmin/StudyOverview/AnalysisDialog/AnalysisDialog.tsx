import React, { FC, useCallback, useState } from "react";
import Divider from "@mui/material/Divider";
import { Button, Dialog } from "@portal/components";
import { Study, Feedback, CloseDialogType } from "../../../../types";
import "./AnalysisDialog.scss";
interface AnalysisDialogProps {
  study?: Study;
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
}

const AnalysisDialog: FC<AnalysisDialogProps> = ({ study, open, onClose }) => {
  const [feedback, setFeedback] = useState<Feedback>({});
  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFeedback({});
      typeof onClose === "function" && onClose(type);
    },
    [onClose, setFeedback]
  );
  return (
    <Dialog
      className="analysis-dialog"
      title="Run analysis"
      open={open}
      onClose={() => handleClose("cancelled")}
      closable
      fullWidth
      maxWidth="md"
    >
      <Divider />
      <div className="analysis-dialog__content">Analysis</div>
    </Dialog>
  );
};

export default AnalysisDialog;
