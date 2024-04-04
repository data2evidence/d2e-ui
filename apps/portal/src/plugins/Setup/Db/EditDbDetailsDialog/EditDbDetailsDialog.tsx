import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import Divider from "@mui/material/Divider";
import { SxProps } from "@mui/material";
import { Autocomplete, Box, Button, Chip, Dialog, TextField } from "@portal/components";
import { CloseDialogType, Feedback, IDatabase } from "../../../../types";
import { api } from "../../../../axios/api";
import { isEqual } from "lodash";
import "./EditDbDetailsDialog.scss";

interface EditDbDialogProps {
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
  db: IDatabase;
}

interface FormData {
  vocabSchemas: string[];
}

const EMPTY_FORM_DATA: FormData = {
  vocabSchemas: [],
};

const styles: SxProps = {
  ".MuiInputLabel-root": {
    color: "#000080",
    "&.MuiInputLabel-shrink, &.Mui-focused": {
      color: "var(--color-neutral)",
    },
  },
  ".MuiInput-input:focus": {
    backgroundColor: "transparent",
    color: "#000080",
  },
  ".MuiInput-root": {
    color: "var(--color-neutral)",
    "&::after, &:hover:not(.Mui-disabled)::before": {
      borderBottom: "2px solid #000080",
    },
  },
};

export const EditDbDetailsDialog: FC<EditDbDialogProps> = ({ open, onClose, db }) => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({});
  const [vocabSchemaOptions, setVocabSchemaOptions] = useState<string[]>([]);
  const hasChanges = useMemo(
    () => !isEqual(db.vocabSchemas, formData.vocabSchemas) && formData.vocabSchemas.length > 0,
    [db, formData]
  );

  useEffect(() => {
    if (open) {
      if (db.dialect === "hana") {
        setVocabSchemaOptions(["CDMVOCAB"]);
      } else {
        setVocabSchemaOptions(["cdmvocab"]);
      }
      setFormData({ vocabSchemas: db.vocabSchemas });
      setFeedback({});
      setLoading(false);
    }
  }, [open]);

  const handleFormDataChange = useCallback((updates: { [field: string]: any }) => {
    setFormData((formData) => ({ ...formData, ...updates }));
  }, []);

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFormData(EMPTY_FORM_DATA);
      typeof onClose === "function" && onClose(type);
    },
    [onClose]
  );

  const handleUpdate = useCallback(async () => {
    try {
      setLoading(true);
      await api.dbCredentialsMgr.updateDbDetails({ id: db.id, vocabSchemas: formData.vocabSchemas });
      setFeedback({
        type: "success",
        message: `Database ${db.code} details updated`,
      });
      handleClose("success");
    } catch (err: any) {
      const message = err?.data?.message || err?.data?.error_description;
      if (message) {
        setFeedback({ type: "error", message });
      } else {
        console.log("There is an error in updating details", err);
        setFeedback({
          type: "error",
          message: "An error has occurred.",
          description: "Please try again. To report the error, please send an email to help@data4life.care.",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return (
    <Dialog
      className="edit-db-dialog"
      title="Edit database details"
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
      feedback={feedback}
    >
      <Divider />
      <div className="edit-db-dialog__content">
        <Box mb={4}>
          <label className="database-code__label">Database Code</label>
          <label className="database-code-value__label">{db.code}</label>
        </Box>
        <Box mb={4}>
          <Box mb={2}>
            <b>Vocab schema</b>
          </Box>
          <Box mb={4}>
            <Autocomplete
              multiple
              freeSolo
              options={vocabSchemaOptions}
              sx={styles}
              id="autocomplete-vocab-schemas"
              renderTags={(value: string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                ))
              }
              renderInput={(params) => <TextField {...params} variant="standard" />}
              value={formData.vocabSchemas}
              onChange={(event, vocabSchemas) => handleFormDataChange({ vocabSchemas })}
            />
          </Box>
        </Box>
      </div>
      <Divider />

      <div className="edit-db-dialog__footer">
        <Box display="flex" gap={1} className="edit-db-dialog__footer-actions">
          <Button text="Cancel" variant="secondary" onClick={() => handleClose("cancelled")} disabled={loading} />
          <Button text="Update" onClick={handleUpdate} loading={loading} disabled={!hasChanges} />
        </Box>
      </div>
    </Dialog>
  );
};
