import React, { FC, useCallback, useState } from "react";
import { TextField, Divider, Select, MenuItem, InputLabel, SelectChangeEvent, FormControl } from "@mui/material";
import { Button, Dialog, Box } from "@portal/components";
import { useTranslation } from "../../../../contexts";
import { i18nKeys } from "../../../../contexts/app-context/states";
import { Study, Feedback, CloseDialogType } from "../../../../types";
import { JobRunTypes } from "../../DQD/types";
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

  const handleSubmit = useCallback(async () => {
    console.log(formData);
  }, [formData]);

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFeedback({});
      typeof onClose === "function" && onClose(type);
    },
    [onClose, setFeedback]
  );

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
          //   disabled={updating}
        />
        <Button text={getText(i18nKeys.UPDATE_STUDY_DIALOG__SAVE)} block onClick={handleSubmit} />
      </div>
    </Dialog>
  );
};

export default AnalysisDialog;
