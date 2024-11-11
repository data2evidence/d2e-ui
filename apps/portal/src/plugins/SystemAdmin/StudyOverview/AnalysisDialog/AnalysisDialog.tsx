import React, { FC, useCallback, useState } from "react";
import { TextField, Divider, Select, MenuItem, InputLabel, SelectChangeEvent, FormControl } from "@mui/material";
import { Button, Dialog, Box } from "@portal/components";
import { useTranslation } from "../../../../contexts";
import { i18nKeys } from "../../../../contexts/app-context/states";
import { Study, Feedback, CloseDialogType, CreateFlowRunByMetadata } from "../../../../types";
import { JobRunTypes } from "../../DQD/types";
import { api } from "../../../../axios/api";

import "./AnalysisDialog.scss";

interface AnalysisDialogProps {
  study?: Study;
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
}

interface FormData {
  type: JobRunTypes;
  comment: string;
}

const INITIAL_FORM_DATA: FormData = {
  type: JobRunTypes.DQD,
  comment: "",
};

const AnalysisDialog: FC<AnalysisDialogProps> = ({ study, open, onClose }) => {
  const { getText } = useTranslation();
  const [feedback, setFeedback] = useState<Feedback>({});
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [updating, setUpdating] = useState(false);

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFeedback({});
      typeof onClose === "function" && onClose(type);
    },
    [onClose, setFeedback]
  );

  const handleSubmit = useCallback(async () => {
    setFeedback({});

    try {
      setUpdating(true);
      const metaData: CreateFlowRunByMetadata = {
        type: formData.type,
        options: {
          datasetId: study?.id,
          vocabSchemaName: study?.vocabSchemaName,
          releaseId: "",
          comment: formData.comment,
        },
      };
      console.log(metaData);
      await api.dataflow.createFlowRunByMetadata(metaData);
      setFeedback({ type: "success", message: "success" });
      setTimeout(() => handleClose("success"), 6000);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.data?.message || err.data,
      });
      console.error("err", err.data);
    } finally {
      setUpdating(false);
    }
  }, [formData, handleClose, study?.id, study?.vocabSchemaName]);

  const handleFormDataChange = useCallback((updates: { [field: string]: any }) => {
    setFormData((formData) => {
      const updated = { ...formData, ...updates };
      return updated;
    });
  }, []);

  return (
    <Dialog
      className="analysis-dialog"
      title="Run analysis"
      open={open}
      onClose={() => handleClose("cancelled")}
      feedback={feedback}
      closable
      fullWidth
      maxWidth="md"
    >
      <Divider />

      <div className="analysis-dialog__content">
        <Box mt={4} mb={4} fontWeight="bold">
          Dataset Analysis Configuration
        </Box>

        <Box mb={4}>
          <FormControl className="select" variant="standard" fullWidth>
            <InputLabel htmlFor="run-type-option">Run type:</InputLabel>
            <Select
              value={formData.type}
              onChange={(event: SelectChangeEvent<string>) => handleFormDataChange({ type: event.target.value })}
            >
              <MenuItem value={JobRunTypes.DQD}>Data Quality Analysis</MenuItem>
              <MenuItem value={JobRunTypes.DataCharacterization}>Data Characterization</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box mb={4}>
          <TextField
            fullWidth
            variant="standard"
            label="comment"
            value={formData.comment}
            onChange={(event) => handleFormDataChange({ comment: event.target.value })}
          />
        </Box>
      </div>

      <Divider />

      <div className="button-group-actions">
        <Button
          text={getText(i18nKeys.UPDATE_STUDY_DIALOG__CANCEL)}
          onClick={() => handleClose("cancelled")}
          variant="outlined"
          block
          disabled={updating}
        />
        <Button text={getText(i18nKeys.UPDATE_STUDY_DIALOG__SAVE)} block loading={updating} onClick={handleSubmit} />
      </div>
    </Dialog>
  );
};

export default AnalysisDialog;
