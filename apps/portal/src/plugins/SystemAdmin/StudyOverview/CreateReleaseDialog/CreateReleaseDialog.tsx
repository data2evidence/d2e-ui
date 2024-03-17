import React, { ChangeEvent, FC, FormEvent, useCallback, useState } from "react";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import { Button, Dialog } from "@portal/components";
import { Study, Feedback, CloseDialogType, UsefulEvent } from "../../../../types";
import webComponentWrapper from "../../../../webcomponents/webComponentWrapper";
import "./CreateReleaseDialog.scss";
import dayjs from "dayjs";
import { CreateHanaReleaseInput } from "../../../../types";
import { SystemPortal } from "../../../../axios/system-portal";

interface CreateReleaseDialogProps {
  study?: Study;
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormData {
  name: string;
  releaseDate: string;
  datasetId: string;
}

const CreateReleaseDialog: FC<CreateReleaseDialogProps> = ({ study, open, onClose, loading, setLoading }) => {
  const [feedback, setFeedback] = useState<Feedback>({});
  const [formData, setFormData] = useState<FormData>({
    name: "",
    releaseDate: dayjs().format("YYYY-MM-DD"),
    datasetId: "",
  });

  const nameRef = webComponentWrapper({
    handleInput: (event: UsefulEvent) => {
      event.preventDefault();
      setFormData({ ...formData, name: event.target.value });
    },
  });

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFeedback({});
      typeof onClose === "function" && onClose(type);
    },
    [onClose, setFeedback]
  );

  const handleTimestampChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setFormData({ ...formData, releaseDate: event.target?.value || "" });
    },
    [formData]
  );

  const handleCreateRelease = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (study == null) return;

      setFeedback({});

      const input: CreateHanaReleaseInput = {
        name: formData.name,
        releaseDate: formData.releaseDate,
        datasetId: study.id,
      };

      try {
        setLoading(true);
        const systemPortalAPI = new SystemPortal();
        await systemPortalAPI.createDatasetRelease(input);
        handleClose("success");
      } catch (err: any) {
        setFeedback({
          type: "error",
          message: `Schema for dataset ${study.id} failed to update`,
          description: err.data?.message || err.data,
        });
        console.error("Error when updating schema", err);
      } finally {
        setLoading(false);
      }
    },
    [study, formData.name, formData.releaseDate, setLoading, handleClose]
  );

  return (
    <Dialog
      className="create-release-dialog"
      title={`Create release - ${study?.studyDetail?.name}`}
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
      feedback={feedback}
    >
      <Divider />
      <div className="create-release-dialog__content">
        <form onSubmit={handleCreateRelease}>
          <div className="u-padding-vertical--normal">
            <d4l-input
              // @ts-ignore
              ref={nameRef}
              label="Release name"
              value={formData.name}
              required
            />
          </div>
          <div className="snapshotdate__filtergroup">
            <TextField
              variant="standard"
              id="date"
              type="date"
              value={formData.releaseDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleTimestampChange}
            />
          </div>
          <Divider />
          <div className="button-group-actions">
            <Button
              type="button"
              text="Cancel"
              onClick={() => handleClose("cancelled")}
              variant="secondary"
              block
              disabled={loading}
            />
            <Button type="submit" text="Create" block loading={loading} />
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default CreateReleaseDialog;
