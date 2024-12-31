import React, { FC, useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@portal/components";
import Divider from "@mui/material/Divider";
import { SxProps } from "@mui/system";
import {
  CloseDialogType,
  Feedback,
  IDatabase,
  INewDatabase,
  IDbCredential,
  IDbCredentialAdd,
  IDbExtra,
  IDbExtraAdd,
  SERVICE_SCOPE_TYPES,
  USER_SCOPE_TYPES,
  DB_DIALECTS,
  CREDENTIAL_USER_SCOPES,
  CREDENTIAL_SERVICE_SCOPES,
} from "../../../../types";
import { api } from "../../../../axios/api";
import { validateCredentials } from "../CredentialValidator";
import { DbCredentialProcessor } from "../CredentialProcessor";
import { isValidJson } from "../../../../utils";
import { useTranslation } from "../../../../contexts";
import { useVocabSchemas } from "../../../../hooks";
import "./SaveDbDialog.scss";

interface SaveDbDialogProps {
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
}

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

interface FormData extends Omit<IDatabase, "id" | "credentials.id"> {}

const dbCredentialProcessor = new DbCredentialProcessor();

const EMPTY_EXTRAS: IDbExtraAdd[] = [
  {
    value: "",
    serviceScope: SERVICE_SCOPE_TYPES.INTERNAL,
  },
  // {
  //   value: "",
  //   serviceScope: SERVICE_SCOPE_TYPES.DATA_PLATFORM,
  // },
];

const EMPTY_CREDENTIALS: IDbCredentialAdd[] = [
  {
    username: "",
    password: "",
    salt: "",
    userScope: USER_SCOPE_TYPES.ADMIN,
    serviceScope: SERVICE_SCOPE_TYPES.INTERNAL,
  },
  {
    username: "",
    password: "",
    salt: "",
    userScope: USER_SCOPE_TYPES.READ,
    serviceScope: SERVICE_SCOPE_TYPES.INTERNAL,
  },
  // {
  //   username: "",
  //   password: "",
  //   salt: "",
  //   userScope: USER_SCOPE_TYPES.DEFAULT,
  //   serviceScope: SERVICE_SCOPE_TYPES.DATA_PLATFORM,
  // },
];

const EMPTY_FORM_DATA: FormData = {
  host: "",
  port: 5432,
  code: "",
  name: "",
  dialect: "postgres",
  extra: EMPTY_EXTRAS,
  credentials: EMPTY_CREDENTIALS,
  vocabSchemas: [],
};

export const SaveDbDialog: FC<SaveDbDialogProps> = ({ open, onClose }) => {
  const { getText, i18nKeys } = useTranslation();
  const [feedback, setFeedback] = useState<Feedback>({});
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);
  const [vocabSchemas] = useVocabSchemas(formData.dialect);

  useEffect(() => {
    if (open) {
      setFormData(EMPTY_FORM_DATA);
      setFeedback({});
      handleDialectChange(EMPTY_FORM_DATA.dialect);
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

  const handleDialectChange = useCallback(
    (dialect: string) => {
      handleFormDataChange({ dialect, vocabSchemas: [] });
    },
    [handleFormDataChange]
  );

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      validateCredentials(formData.credentials, setFeedback);

      const encryptedCredentials = formData.credentials
        .filter((cred) => Boolean(cred.username))
        .map(async (cred: IDbCredential) => dbCredentialProcessor.encryptDbCredential(cred));
      const credentials = await Promise.all(encryptedCredentials);

      const internalExtra = formData.extra.find((ext) => ext.serviceScope === SERVICE_SCOPE_TYPES.INTERNAL);
      const dataPlatformExtra = formData.extra.find((ext) => ext.serviceScope === SERVICE_SCOPE_TYPES.DATA_PLATFORM);

      const newExtra: { [key: string]: object } = {};
      if (internalExtra) {
        if (internalExtra.value) {
          if (!isValidJson(internalExtra.value)) {
            setFeedback({
              type: "error",
              message: getText(i18nKeys.SAVE_DB_DIALOG__ENTER_VALID_JSON_INTERNAL),
            });
            return;
          }
          newExtra["Internal"] = JSON.parse(internalExtra.value);
        } else {
          newExtra["Internal"] = {};
        }
      }

      if (dataPlatformExtra) {
        if (dataPlatformExtra.value) {
          if (!isValidJson(dataPlatformExtra.value)) {
            setFeedback({
              type: "error",
              message: getText(i18nKeys.SAVE_DB_DIALOG__ENTER_VALID_JSON_DATA_PLATFORM),
            });
            return;
          }
          newExtra["DataPlatform"] = JSON.parse(dataPlatformExtra.value);
        } else {
          newExtra["DataPlatform"] = {};
        }
      }

      const encrypted: INewDatabase = { ...formData, extra: newExtra, credentials };
      await api.dbCredentialsMgr.addDb(encrypted);

      setFeedback({
        type: "success",
        message: getText(i18nKeys.SAVE_DB_DIALOG__SUCCESS),
        autoClose: 60000,
      });

      setFormData(EMPTY_FORM_DATA);

      handleClose("success");
    } catch (err: any) {
      const message = err?.data?.message || err?.data?.error_description || err.message;
      if (message) {
        setFeedback({ type: "error", message });
      } else {
        console.error("There is an error in saving database", err);
        setFeedback({
          type: "error",
          message: getText(i18nKeys.SAVE_DB_DIALOG__ERROR),
          description: getText(i18nKeys.SAVE_DB_DIALOG__ERROR_MESSAGE),
        });
      }
    } finally {
      setSaving(false);
    }
  }, [handleClose, formData, setFeedback, getText]);

  return (
    <Dialog
      className="save-db-dialog"
      title={getText(i18nKeys.SAVE_DB_DIALOG__ADD_DATABASE)}
      feedback={feedback}
      closable
      fullWidth
      maxWidth="md"
      open={open}
      onClose={() => handleClose("cancelled")}
    >
      <Divider />
      <div className="save-db-dialog__content">
        <Box mb={4} display="flex" gap={4}>
          <TextField
            label={getText(i18nKeys.SAVE_DB_DIALOG__HOST)}
            variant="standard"
            sx={{ minWidth: "300px" }}
            value={formData.host}
            onChange={(event) => handleFormDataChange({ host: event.target?.value })}
          />
          <TextField
            label={getText(i18nKeys.SAVE_DB_DIALOG__PORT)}
            variant="standard"
            type="number"
            sx={{ width: "150px" }}
            value={formData.port}
            onChange={(event) => handleFormDataChange({ port: Number(event.target?.value || 0) })}
          />
          <FormControl fullWidth variant="standard">
            <InputLabel id="dialect-select-label">{getText(i18nKeys.SAVE_DB_DIALOG__DIALECT)}</InputLabel>
            <Select
              labelId="dialect-select-label"
              id="dialect-select"
              value={formData.dialect}
              onChange={(event) => handleDialectChange(event.target?.value)}
            >
              {DB_DIALECTS.map((dialect) => (
                <MenuItem value={dialect} key={dialect}>
                  {dialect}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mb={4} display="flex" gap={4}>
          <TextField
            label={getText(i18nKeys.SAVE_DB_DIALOG__DATABASE_CODE)}
            variant="standard"
            sx={{ minWidth: "300px" }}
            value={formData.code}
            onChange={(event) => handleFormDataChange({ code: event.target?.value })}
          />
          <TextField
            label={getText(i18nKeys.SAVE_DB_DIALOG__DATABASE_NAME)}
            variant="standard"
            sx={{ minWidth: "300px" }}
            value={formData.name}
            onChange={(event) => handleFormDataChange({ name: event.target?.value })}
          />
        </Box>

        <Box fontWeight="bold">{getText(i18nKeys.SAVE_DB_DIALOG__VOCAB_SCHEMAS)}</Box>
        <Box mb={4}>
          <Autocomplete
            multiple
            options={vocabSchemas || []}
            sx={styles}
            id="autocomplete-vocab-schemas"
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
              ))
            }
            renderInput={(params) => <TextField {...params} variant="standard" />}
            value={formData.vocabSchemas}
            onChange={(_, vocabSchemas) => handleFormDataChange({ vocabSchemas })}
          />
        </Box>
        <Box mb={4}>
          <Box mb={2}>
            <b>{getText(i18nKeys.SAVE_DB_DIALOG__EXTRA)}</b>
          </Box>
          {formData?.extra?.map((extra, index) => (
            <Box key={index} display="flex" gap={3} mb={1}>
              <Box flex="1">
                <TextField
                  label={getText(i18nKeys.SAVE_DB_DIALOG__VALUE)}
                  variant="standard"
                  fullWidth
                  value={extra.value}
                  onChange={(event) =>
                    handleFormDataChange({
                      extra: [
                        ...formData.extra.slice(0, index),
                        {
                          ...formData.extra[index],
                          value: event.target?.value,
                        } as IDbExtra,
                        ...formData.extra.slice(index + 1, formData.extra.length),
                      ],
                    })
                  }
                />
              </Box>
              <Box sx={{ width: "130px" }}>
                <FormControl fullWidth variant="standard">
                  <InputLabel id="service-scope-label">{getText(i18nKeys.SAVE_DB_DIALOG__SERVICE)}</InputLabel>
                  <Select
                    labelId="service-scope-label"
                    id="service-scope"
                    readOnly
                    inputProps={{
                      tabIndex: -1,
                    }}
                    sx={{
                      "::before, ::after": {
                        borderBottom: "0 !important",
                      },
                      ".MuiSvgIcon-root": {
                        display: "none",
                      },
                    }}
                    value={extra.serviceScope}
                  >
                    {CREDENTIAL_SERVICE_SCOPES.map((scope) => (
                      <MenuItem value={scope} key={scope}>
                        {scope}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          ))}
        </Box>
        <Box mb={4}>
          <Box mb={2}>
            <b>{getText(i18nKeys.SAVE_DB_DIALOG__CREDENTIALS)}</b>
          </Box>
          {formData?.credentials?.map((cred, index) => (
            <Box key={index} display="flex" gap={3} mb={1}>
              <Box sx={{ width: "100px" }}>
                <FormControl fullWidth variant="standard">
                  <InputLabel id="user-scope-label">{getText(i18nKeys.SAVE_DB_DIALOG__PRIVILEGE)}</InputLabel>
                  <Select
                    labelId="user-scope-label"
                    id="user-scope"
                    readOnly
                    inputProps={{
                      tabIndex: -1,
                    }}
                    sx={{
                      "::before, ::after": {
                        borderBottom: "0 !important",
                      },
                      ".MuiSvgIcon-root": {
                        display: "none",
                      },
                    }}
                    value={cred.userScope}
                    onChange={(event) =>
                      handleFormDataChange({
                        credentials: [
                          ...formData.credentials.slice(0, index),
                          {
                            ...formData.credentials[index],
                            userScope: event.target?.value,
                          } as IDbCredential,
                          ...formData.credentials.slice(index + 1, formData.credentials.length),
                        ],
                      })
                    }
                  >
                    {CREDENTIAL_USER_SCOPES.map((scope) => (
                      <MenuItem value={scope} key={scope}>
                        {scope}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box flex="1">
                <TextField
                  label={getText(i18nKeys.SAVE_DB_DIALOG__USERNAME)}
                  variant="standard"
                  fullWidth
                  value={cred.username}
                  onChange={(event) =>
                    handleFormDataChange({
                      credentials: [
                        ...formData.credentials.slice(0, index),
                        {
                          ...formData.credentials[index],
                          username: event.target?.value,
                        } as IDbCredential,
                        ...formData.credentials.slice(index + 1, formData.credentials.length),
                      ],
                    })
                  }
                />
              </Box>
              <Box sx={{ width: "200px" }}>
                <TextField
                  label={getText(i18nKeys.SAVE_DB_DIALOG__PASSWORD)}
                  variant="standard"
                  type="password"
                  sx={{ width: "200px" }}
                  value={cred.password}
                  onChange={(event) =>
                    handleFormDataChange({
                      credentials: [
                        ...formData.credentials.slice(0, index),
                        {
                          ...formData.credentials[index],
                          password: event.target?.value,
                        } as IDbCredential,
                        ...formData.credentials.slice(index + 1, formData.credentials.length),
                      ],
                    })
                  }
                />
              </Box>
              <Box sx={{ width: "130px" }}>
                <FormControl fullWidth variant="standard">
                  <InputLabel id="service-scope-label">{getText(i18nKeys.SAVE_DB_DIALOG__SERVICE)}</InputLabel>
                  <Select
                    labelId="service-scope-label"
                    id="service-scope"
                    readOnly
                    inputProps={{
                      tabIndex: -1,
                    }}
                    sx={{
                      "::before, ::after": {
                        borderBottom: "0 !important",
                      },
                      ".MuiSvgIcon-root": {
                        display: "none",
                      },
                    }}
                    value={cred.serviceScope}
                    onChange={(event) =>
                      handleFormDataChange({
                        credentials: [
                          ...formData.credentials.slice(0, index),
                          {
                            ...formData.credentials[index],
                            serviceScope: event.target?.value,
                          } as IDbCredential,
                          ...formData.credentials.slice(index + 1, formData.credentials.length),
                        ],
                      })
                    }
                  >
                    {CREDENTIAL_SERVICE_SCOPES.map((scope) => (
                      <MenuItem value={scope} key={scope}>
                        {scope}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          ))}
        </Box>
      </div>
      <div className="save-db-dialog__footer">
        <Box display="flex" gap={1} className="save-db-dialog__footer-actions">
          <Button
            text={getText(i18nKeys.SAVE_DB_DIALOG__CANCEL)}
            variant="outlined"
            onClick={() => handleClose("cancelled")}
          />
          <Button text={getText(i18nKeys.SAVE_DB_DIALOG__SAVE)} onClick={handleSave} loading={saving} />
        </Box>
      </div>
    </Dialog>
  );
};
