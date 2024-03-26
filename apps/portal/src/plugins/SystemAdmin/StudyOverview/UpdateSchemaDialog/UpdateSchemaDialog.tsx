import React, { FC, useCallback, useState } from "react";
import Divider from "@mui/material/Divider";
import { Button, Dialog } from "@portal/components";
import { Study, Feedback, CloseDialogType, UpdateSchemaInput } from "../../../../types";
import { Gateway } from "../../../../axios/gateway";
import "./UpdateSchemaDialog.scss";

interface UpdateSchemaDialogProps {
  study?: Study;
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
}

const UpdateSchemaDialog: FC<UpdateSchemaDialogProps> = ({ study, open, onClose }) => {
  const [feedback, setFeedback] = useState<Feedback>({});
  const [updating, setUpdating] = useState(false);

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFeedback({});
      typeof onClose === "function" && onClose(type);
    },
    [onClose, setFeedback]
  );

  const handleUpdate = useCallback(async () => {
    if (study == null) return;

    const input: UpdateSchemaInput = {
      schemaName: study.schemaName,
      dataModel: study.dataModel,
      databaseCode: study.databaseCode,
      dialect: study.dialect ? study.dialect : "",
      vocabSchemaValue: study.vocabSchemaName ? study.vocabSchemaName : "",
    };

    try {
      setUpdating(true);
      const gatewayAPI = new Gateway();
      await gatewayAPI.updateSchema(input);
      handleClose("success");
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: `Schema for dataset ${study.id} failed to update`,
        description: err.data?.message || err.data,
      });
      console.error("Error when updating schema", err);
    } finally {
      setUpdating(false);
    }
  }, [study, setFeedback, handleClose]);

  return (
    <Dialog
      className="update-schema-dialog"
      title="Update schema"
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
      feedback={feedback}
    >
      <Divider />
      <div className="update-schema-dialog__content">
        <div>Are you sure you want to update the schema of this dataset:</div>
        <div>{study!.id} ?</div>
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button text="Cancel" onClick={() => handleClose("cancelled")} variant="secondary" block disabled={updating} />
        <Button text="Yes, update" onClick={handleUpdate} block loading={updating} />
      </div>
    </Dialog>
  );
};

export default UpdateSchemaDialog;
