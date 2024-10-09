import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import Divider from "@mui/material/Divider";
import { SxProps } from "@mui/material";
import { Autocomplete, Box, Button, Chip, Dialog, TextArea, TextField } from "@portal/components";
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
  name: string;
  host: string;
  port: number;
  vocabSchemas: string[];
  extra: string;
}

const EMPTY_FORM_DATA: FormData = {
  name: "",
  host: "",
  port: 5432,
  vocabSchemas: [],
  extra: "",
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

const mapExtraToHashmap = (extraArr: any[]): { [key: string]: any } => {
  const extra: any = {};
  extraArr.forEach((e) => {
    extra[e.serviceScope] = e.value;
  });
  return extra;
};

export const EditDbDetailsDialog: FC<EditDbDialogProps> = ({ open, onClose, db }) => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);
  const [originalExtra, setOriginalExtra] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({});
  const [vocabSchemaOptions, setVocabSchemaOptions] = useState<string[]>([]);
  const hasChanges = useMemo(
    () =>
      !isEqual(db.name, formData.name) ||
      !isEqual(db.host, formData.host) ||
      !isEqual(db.port, formData.port) ||
      (!isEqual(db.vocabSchemas, formData.vocabSchemas) && formData.vocabSchemas.length > 0) ||
      originalExtra !== formData.extra,
    [db, formData, originalExtra]
  );

  useEffect(() => {
    if (open) {
      if (db.dialect === "hana") {
        setVocabSchemaOptions(["CDMVOCAB"]);
      } else {
        setVocabSchemaOptions(["cdmvocab"]);
      }
      const extraStr = JSON.stringify(mapExtraToHashmap(db.extra), null, 4);
      setFormData({ name: db.name, host: db.host, port: db.port, vocabSchemas: db.vocabSchemas, extra: extraStr });
      setOriginalExtra(extraStr);
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
      await api.dbCredentialsMgr.updateDbDetails({
        id: db.id,
        name: formData.name,
        host: formData.host,
        port: formData.port,
        vocabSchemas: formData.vocabSchemas,
        extra: formData.extra ? JSON.parse(formData.extra) : {},
      });
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
      fullWidth
      maxWidth="md"
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
            <b>Database Name</b>
          </Box>
          <Box mb={4}>
            <TextField
              fullWidth
              variant="standard"
              value={formData.name}
              onChange={(event) => handleFormDataChange({ name: event.target.value })}
            />
          </Box>

          <Box mb={2} display="flex" gap={4}>
            <Box sx={{ width: "100%" }}>
              <Box mb={2}>
                <b>Host</b>
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  variant="standard"
                  value={formData.host}
                  onChange={(event) => handleFormDataChange({ host: event.target.value })}
                />
              </Box>
            </Box>
            <Box>
              <Box mb={2}>
                <b>Port</b>
              </Box>
              <Box mb={4}>
                <TextField
                  variant="standard"
                  type="number"
                  sx={{ width: "150px" }}
                  value={formData.port}
                  onChange={(event) => handleFormDataChange({ port: Number(event.target.value) })}
                />
              </Box>
            </Box>
          </Box>

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
        <Box mb={4}>
          <Box mb={2}>
            <b>Extra</b>
          </Box>
          <Box>
            <TextArea
              rows={10}
              value={formData.extra}
              onChange={(event) => handleFormDataChange({ extra: event.target.value })}
            />
          </Box>
        </Box>
      </div>
      <Divider />

      <div className="edit-db-dialog__footer">
        <Box display="flex" gap={1} className="edit-db-dialog__footer-actions">
          <Button text="Cancel" variant="outlined" onClick={() => handleClose("cancelled")} disabled={loading} />
          <Button text="Update" onClick={handleUpdate} loading={loading} disabled={!hasChanges} />
        </Box>
      </div>
    </Dialog>
  );
};
