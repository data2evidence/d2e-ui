import React, { FC, useCallback, useState } from "react";
import { Button, Dialog } from "@portal/components";
import { Feedback, UsefulEvent, CloseDialogType, Flow } from "../../../../types";
import Divider from "@mui/material/Divider";
import FormHelperText from "@mui/material/FormHelperText";
import webComponentWrapper from "../../../../webcomponents/webComponentWrapper";
import { api } from "../../../../axios/api";
import "./DeleteFlowDialog.scss";

interface DeleteFlowDialogProps {
  flow?: Flow;
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
}

const DeleteFlowDialog: FC<DeleteFlowDialogProps> = ({ flow, open, onClose }) => {
  const [feedback, setFeedback] = useState<Feedback>({});
  const [inputData, setInputData] = useState("");
  const [inputError, setInputError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFeedback({});
      setInputData("");
      typeof onClose === "function" && onClose(type);
    },
    [onClose, setFeedback]
  );

  const isInputError = useCallback(() => {
    if (inputData !== flow?.name) {
      setInputError(true);
      return true;
    } else {
      setInputError(false);
      return false;
    }
  }, [inputData, flow]);

  const deleteFlow = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await api.dataflow.deleteFlow(id);
      } catch (error: any) {
        console.log(error);
        setFeedback({
          type: "error",
          message: `Flow ${flow?.name} failed to delete`,
          description: error.data.message,
        });
      } finally {
        setLoading(false);
      }
    },
    [flow]
  );

  const handleDelete = useCallback(async () => {
    if (flow == null) return;
    if (isInputError()) return;
    await deleteFlow(flow.id);
    handleClose("success");
  }, [flow, isInputError, deleteFlow, handleClose]);

  return (
    <Dialog
      className="delete-flow-dialog"
      title="Delete flow"
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
      feedback={feedback}
    >
      <Divider />
      <div className="delete-flow-dialog__content">
        <div className="delete-flow-dialog__content-text">
          <div>
            Are you sure you want to permanently delete the following <br />
            flow: <strong>&quot;{flow!.name}&quot;</strong>? <br />
          </div>
          <div>This action cannot be undone. Deleted data cannot be recovered.</div>
          <div>Type the flow name to confirm.</div>
        </div>
        <div className="delete-flow-dialog__content-input">
          <d4l-input
            // @ts-ignore
            ref={webComponentWrapper({
              handleInput: (event: UsefulEvent) => {
                setInputData(event.target.value);
              },
            })}
            label="Enter flow name"
            error={inputError}
            value={inputData}
          />
          {inputError && <FormHelperText>Enter the exact flow name</FormHelperText>}
        </div>
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button text="Cancel" onClick={() => handleClose("cancelled")} variant="secondary" block disabled={loading} />
        <Button text="Confirm deletion" onClick={handleDelete} block loading={loading} />
      </div>
    </Dialog>
  );
};

export default DeleteFlowDialog;
