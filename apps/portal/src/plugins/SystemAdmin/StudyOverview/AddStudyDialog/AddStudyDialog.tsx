import React, {
  FC,
  useCallback,
  useState,
  useEffect,
  ChangeEvent,
  SetStateAction,
  SyntheticEvent,
  useMemo,
} from "react";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { SxProps } from "@mui/system";
import { Button, Dialog, Checkbox, Autocomplete, TextField, IconButton, AddSquareIcon, Box } from "@portal/components";
import {
  NewStudyInput,
  Feedback,
  CloseDialogType,
  Study,
  IDatabase,
  NewStudyMetadataInput,
  DatasetDashboard,
  NewFhirProjectInput,
} from "../../../../types";
import SimpleMDE from "react-simplemde-editor";
import {
  useDatasetAttributeConfigs,
  useDatasetTagConfigs,
  usePaConfigs,
  useTenant,
  useVocabSchemas,
} from "../../../../hooks";
import MetadataForm from "../UpdateStudyDialog/MetadataForm/MetadataForm";
import {
  DashboardForm,
  DashboardFormError,
  EMPTY_DASHBOARD_FORM_DATA,
  EMPTY_DASHBOARD_FORM_ERROR,
} from "../UpdateStudyDialog/DashboardForm/DashboardForm";
import "./AddStudyDialog.scss";
import { api } from "../../../../axios/api";
import { useTranslation } from "../../../../contexts";

interface AddStudyDialogProps {
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  studies: Study[];
  databases: IDatabase[];
}

const mdeOptions = {
  hideIcons: ["side-by-side", "fullscreen"],
  maxHeight: "150px",
};

interface FormData {
  type: string;
  tokenStudyCode: string;
  schemaOption: string;
  cdmSchemaValue: string;
  isSameCdmSchemaForVocab: boolean;
  vocabSchemaValue: string;
  name: string;
  summary: string;
  showRequestAccess: boolean;
  createFhirProject: boolean;
  cleansedSchemaOption: boolean;
  description: string;
  dataModel: string;
  databaseCode: string;
  dialect: string;
  paConfigId: string;
  visibilityStatus: string;
}

interface FormError {
  tenantId: {
    required: boolean;
  };
  schemaOption: {
    required: boolean;
  };
  cdmSchemaValue: {
    required: boolean;
  };
  vocabSchemaValue: {
    required: boolean;
  };
  tokenStudyCode: {
    required: boolean;
    valid: boolean;
  };
  dataModel: {
    required: boolean;
  };
  databaseCode: {
    required: boolean;
  };
  paConfigId: {
    required: boolean;
  };
  name: {
    required: boolean;
  };
}

const EMPTY_FORM_ERROR: FormError = {
  tenantId: { required: false },
  tokenStudyCode: { required: false, valid: false },
  schemaOption: { required: false },
  cdmSchemaValue: { required: false },
  vocabSchemaValue: { required: false },
  dataModel: { required: false },
  databaseCode: { required: false },
  paConfigId: { required: false },
  name: { required: false },
};

const EMPTY_FORM_DATA: FormData = {
  type: "",
  tokenStudyCode: "",
  schemaOption: "",
  cdmSchemaValue: "", //Optional
  isSameCdmSchemaForVocab: false,
  vocabSchemaValue: "", //Optional
  name: "",
  summary: "",
  showRequestAccess: false,
  createFhirProject: false,
  cleansedSchemaOption: false,
  description: "",
  dataModel: "", //Optional
  databaseCode: "", //Optional
  dialect: "",
  paConfigId: "",
  visibilityStatus: "DEFAULT",
};

const EMPTY_STUDY_METADATA: NewStudyMetadataInput = { attributeId: "", value: "" };

/**
 * Schema Options Values
 */
interface dropdownOption {
  title: string;
  type: string;
}

interface Datamodel {
  name: string;
  datamodel: string;
  flowId: string;
}

export const SchemaTypes = {
  CreateCDM: "create_cdm",
  NoCDM: "no_cdm",
  CustomCDM: "custom_cdm",
  ExistingCDM: "existing_cdm",
};

const styles: SxProps = {
  color: "#000080",
  "&::after, &:hover:not(.Mui-disabled)::before": {
    borderBottom: "2px solid #000080",
  },
  ".MuiInputLabel-root": {
    color: "#000080",
    "&.MuiInputLabel-shrink, &.Mui-focused": {
      color: "var(--color-neutral)",
    },
  },
  ".MuiInput-input:focus": {
    backgroundColor: "transparent",
  },
  "&.MuiMenuItem-root:hover": {
    backgroundColor: "#ebf2fa",
  },
};

/**
 * Dialog shown when user is adding a study in superadmin
 * @param param0 AddStudyDialogProps
 * @returns The dialog object
 */
const AddStudyDialog: FC<AddStudyDialogProps> = ({ open, onClose, loading, setLoading, studies, databases }) => {
  const { getText, i18nKeys } = useTranslation();
  const [tenant] = useTenant();
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);
  const [formError, setFormError] = useState<FormError>(EMPTY_FORM_ERROR);
  const [dataModels, setDataModels] = useState<Datamodel[]>([]);
  const [schemas, setSchemas] = useState<string[]>([]);
  const [paConfigs] = usePaConfigs();
  const [vocabSchemas] = useVocabSchemas(databases, formData.databaseCode);
  const [tagConfigs] = useDatasetTagConfigs();
  const [attributeConfigs] = useDatasetAttributeConfigs();
  const [studyMetadata, setStudyMetadata] = useState<NewStudyMetadataInput[]>([EMPTY_STUDY_METADATA]);
  const [studyTagsData, setStudyTagsData] = useState<Array<string>>([]);
  const [dashboards, setDashboards] = useState<DatasetDashboard[]>([]);

  const [feedback, setFeedback] = useState<Feedback>({});
  const [formMetadataErrorIndex, setFormMetadataErrorIndex] = useState<Array<Number>>([]);
  const [dashboardErrorIndex, setDashboardErrorIndex] = useState<Record<number, DashboardFormError>>({});

  const SchemaOptions: dropdownOption[] = [
    {
      title: getText(i18nKeys.ADD_STUDY_DIALOG__CREATE_NEW_SCHEMA),
      type: SchemaTypes.CreateCDM,
    },
    {
      title: getText(i18nKeys.ADD_STUDY_DIALOG__CREATE_NEW_SCHEMA_EXISTING_NAME),
      type: SchemaTypes.CustomCDM,
    },
    {
      title: getText(i18nKeys.ADD_STUDY_DIALOG__NO_SCHEMA),
      type: SchemaTypes.NoCDM,
    },
    {
      title: getText(i18nKeys.ADD_STUDY_DIALOG__EXISTING_SCHEMA),
      type: SchemaTypes.ExistingCDM,
    },
  ];

  const displayDatabases = useMemo(
    () => [SchemaTypes.CreateCDM, SchemaTypes.CustomCDM, SchemaTypes.ExistingCDM].includes(formData.schemaOption),
    [formData.schemaOption]
  );

  const displayDataModels = useMemo(
    () => formData.databaseCode && formData.schemaOption !== SchemaTypes.NoCDM,
    [formData.schemaOption, formData.databaseCode]
  );

  const displaySameCdmVocabSchemaCheckbox = useMemo(
    () => [SchemaTypes.CreateCDM, SchemaTypes.CustomCDM].includes(formData.schemaOption),
    [formData.schemaOption]
  );

  const displayVocabSchemaDropdown = useMemo(
    () =>
      formData.databaseCode &&
      !formData.isSameCdmSchemaForVocab &&
      [SchemaTypes.CreateCDM, SchemaTypes.CustomCDM].includes(formData.schemaOption),
    [formData.databaseCode, formData.isSameCdmSchemaForVocab, formData.schemaOption]
  );

  const displayVocabSchemaInput = useMemo(
    () => formData.schemaOption === SchemaTypes.ExistingCDM,
    [formData.schemaOption]
  );

  const displaySchemaNameInput = useMemo(
    () => formData.schemaOption === SchemaTypes.CustomCDM || formData.schemaOption === SchemaTypes.ExistingCDM,
    [formData.schemaOption]
  );

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFeedback({});
      setFormData(EMPTY_FORM_DATA);
      setFormError(EMPTY_FORM_ERROR);
      setStudyMetadata([]);
      setStudyTagsData([]);
      setDashboards([]);
      typeof onClose === "function" && onClose(type);
    },
    [onClose, setFeedback]
  );

  const getDataModels = useCallback(async () => {
    try {
      const dataModelResult = await api.dataflow.getDatamodels();
      setDataModels(dataModelResult);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (formData.schemaOption !== SchemaTypes.NoCDM && formData.databaseCode) {
      const db = databases.find((db) => db.code === formData.databaseCode);
      if (db) {
        getDataModels();
      }
    }
  }, [databases, formData.databaseCode, formData.schemaOption, getDataModels]);

  useEffect(() => {
    const getSchemas = () => {
      const filterByDb = (isCurrentDb: boolean) => {
        return studies
          .filter((study) => {
            if (study.schemaName)
              return isCurrentDb
                ? study.databaseCode === formData.databaseCode
                : study.databaseCode !== formData.databaseCode;
          })
          .map((study) => study.schemaName.toUpperCase());
      };

      const filteredSchemas = filterByDb(false).filter((schema) => filterByDb(true).indexOf(schema) === -1);
      setSchemas(filteredSchemas);
    };
    getSchemas();
  }, [formData.databaseCode, studies]);

  const handleFormDataChange = useCallback((changes: { [field: string]: any }) => {
    setFormData((formData) => ({ ...formData, ...changes }));
  }, []);

  const handleRemoveLine = useCallback(
    <T extends {}>(index: number, state: Array<T>, setState: (value: SetStateAction<T[]>) => void) => {
      const copyLine = [...state];
      copyLine.splice(index, 1);
      setState(copyLine);
    },
    []
  );

  const handleAddMetadataForm = useCallback(() => {
    setStudyMetadata([...studyMetadata, EMPTY_STUDY_METADATA]);
  }, [studyMetadata]);

  const handleMetadataChange = useCallback(
    (attributeId: string, valueNew: string, index: number) => {
      const newMetadata = { attributeId: attributeId, value: valueNew };
      const currentMetadata = [...studyMetadata];
      currentMetadata[index] = newMetadata;
      setStudyMetadata(currentMetadata);
    },
    [studyMetadata]
  );

  const handleTagChange = useCallback((event: any, value: string[]) => {
    setStudyTagsData(value);
  }, []);

  const tokenIsValid = useCallback((token: string) => {
    const tokenFormat = /^[a-zA-Z0-9_]{1,80}$/;
    if (token.match(tokenFormat)) {
      return true;
    }
  }, []);

  const isFormError = useCallback(() => {
    const {
      tokenStudyCode,
      schemaOption,
      cdmSchemaValue,
      isSameCdmSchemaForVocab,
      vocabSchemaValue,
      dataModel,
      databaseCode,
      paConfigId,
      name,
    } = formData;

    let formError: FormError | {} = {};
    if (!tokenStudyCode) {
      formError = { ...formError, tokenStudyCode: { required: true } };
    }

    if (tokenStudyCode && !tokenIsValid(tokenStudyCode)) {
      formError = { ...formError, tokenStudyCode: { valid: true } };
    }

    if (schemaOption !== SchemaTypes.NoCDM && !databaseCode) {
      formError = { ...formError, databaseCode: { required: true } };
    }

    if (!schemaOption) {
      formError = { ...formError, schemaOption: { required: true } };
    }

    if (schemaOption == SchemaTypes.CustomCDM && cdmSchemaValue == "" && !schemas.includes(formData.cdmSchemaValue)) {
      formError = { ...formError, cdmSchemaValue: { required: true } };
    }

    if (schemaOption == SchemaTypes.ExistingCDM && cdmSchemaValue == "") {
      formError = { ...formError, cdmSchemaValue: { required: true } };
    }

    if (schemaOption != SchemaTypes.NoCDM && dataModel == "") {
      formError = { ...formError, dataModel: { required: true } };
    }

    if (
      [SchemaTypes.CreateCDM, SchemaTypes.CustomCDM].includes(schemaOption) &&
      !isSameCdmSchemaForVocab &&
      !vocabSchemaValue
    ) {
      formError = { ...formError, vocabSchemaValue: { required: true } };
    }

    if (schemaOption === SchemaTypes.ExistingCDM && !vocabSchemaValue) {
      formError = { ...formError, vocabSchemaValue: { required: true } };
    }

    if (!paConfigId) {
      formError = { ...formError, paConfigId: { required: true } };
    }

    if (!name) {
      formError = { ...formError, name: { required: true } };
    }

    if (Object.keys(formError).length > 0) {
      setFormError({ ...EMPTY_FORM_ERROR, ...(formError as FormError) });
      return true;
    }
    return false;
  }, [formData, schemas, tokenIsValid]);

  const isFormMetadataError = useCallback(() => {
    const indexError: Number[] = [];
    studyMetadata.forEach((metadata, index) => {
      if (!metadata.value && metadata.attributeId) {
        indexError.push(index);
      }
    });

    setFormMetadataErrorIndex(indexError);
    return indexError.length > 0;
  }, [studyMetadata]);

  const isDashboardError = useCallback(() => {
    const formError: Record<number, DashboardFormError> = {};

    let hasError = false;
    dashboards.forEach((dashboard, index) => {
      formError[index] = EMPTY_DASHBOARD_FORM_ERROR;
      if (!dashboard.name && dashboard.url) {
        formError[index] = { ...formError[index], name: { required: true } };
        hasError = true;
      }
      if (!dashboard.url && dashboard.name) {
        formError[index] = { ...formError[index], url: { required: true } };
        hasError = true;
      }
    });

    setDashboardErrorIndex(formError);
    return hasError;
  }, [dashboards]);

  const handleSubmit = useCallback(async () => {
    if (isFormError() || isFormMetadataError() || isDashboardError()) {
      return;
    }

    setFeedback({});
    setFormError(EMPTY_FORM_ERROR);

    const {
      type,
      tokenStudyCode,
      schemaOption,
      cdmSchemaValue,
      vocabSchemaValue,
      cleansedSchemaOption,
      createFhirProject,
      name,
      summary,
      showRequestAccess,
      description,
      dataModel,
      databaseCode,
      dialect,
      paConfigId,
      visibilityStatus,
    } = formData;

    const input: NewStudyInput = {
      tenantId: tenant?.id || "",
      detail: {
        name,
        summary,
        description,
        showRequestAccess,
      },
      type,
      tokenStudyCode,
      schemaOption,
      cdmSchemaValue,
      vocabSchemaValue,
      cleansedSchemaOption,
      tenantName: tenant?.name || "",
      dataModel,
      databaseCode,
      dialect,
      paConfigId,
      visibilityStatus,
      attributes: studyMetadata.filter((info) => info.attributeId !== ""),
      tags: studyTagsData?.map((tagName) => tagName),
      dashboards: dashboards.filter((dashboard) => dashboard.name !== ""),
    };

    try {
      setLoading(true);
      await api.gateway.createDataset(input);
      if (createFhirProject) {
        const fhirProjectInput: NewFhirProjectInput = {
          name: name,
          description: description,
        };
        await api.gateway.createFhirStaging(fhirProjectInput);
      }
      handleClose("success");
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.data?.message || err.data,
      });
      console.error("err", err.data);
    } finally {
      setLoading(false);
    }
  }, [
    formData,
    tenant,
    studyMetadata,
    studyTagsData,
    dashboards,
    isFormError,
    isFormMetadataError,
    isDashboardError,
    setLoading,
    handleClose,
  ]);

  return (
    <Dialog
      className="add-study-dialog"
      title={getText(i18nKeys.ADD_STUDY_DIALOG__ADD_DATASET)}
      closable
      fullWidth
      maxWidth="md"
      open={open}
      onClose={() => handleClose("cancelled")}
      feedback={feedback}
    >
      <Divider />
      <div className="add-study-dialog__content">
        <Box mt={4} fontWeight="bold">
          {getText(i18nKeys.ADD_STUDY_DIALOG__INFO_CONFIG)}
        </Box>
        <Box mb={4}>
          <TextField
            fullWidth
            variant="standard"
            label={getText(i18nKeys.ADD_STUDY_DIALOG__DATASET_NAME)}
            value={formData.name}
            onChange={(event) => handleFormDataChange({ name: event.target.value })}
            error={formError.name.required}
          />
          {formError.name.required && (
            <FormHelperText error={true}>{getText(i18nKeys.ADD_STUDY_DIALOG__REQUIRED)}</FormHelperText>
          )}
        </Box>
        <Box mb={4}>
          <TextField
            fullWidth
            variant="standard"
            label={getText(i18nKeys.ADD_STUDY_DIALOG__DATASET_SUMMARY)}
            value={formData.summary}
            onChange={(event) => handleFormDataChange({ summary: event.target.value })}
          />
        </Box>
        <div>
          <Checkbox
            checked={formData.showRequestAccess}
            checkbox-id="request-access"
            label={getText(i18nKeys.ADD_STUDY_DIALOG__SHOW_REQUEST_ACCESS)}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              handleFormDataChange({ showRequestAccess: event.target.checked });
            }}
          />
        </div>
        <div>
          <Checkbox
            checked={formData.createFhirProject}
            checkbox-id="create-fhir-server"
            label={getText(i18nKeys.ADD_STUDY_DIALOG__CREATE_FHIR)}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              handleFormDataChange({ createFhirProject: event.target.checked });
            }}
          />
        </div>
        <div>{getText(i18nKeys.ADD_STUDY_DIALOG__DESCRIPTION)}</div>
        <SimpleMDE
          value={formData.description}
          onChange={(value) => handleFormDataChange({ description: value })}
          options={mdeOptions}
          style={{ marginTop: "11px" }}
        />
        {/* Schema Options */}
        <Box mb={4}>
          <FormControl
            sx={styles}
            className="select"
            variant="standard"
            fullWidth
            {...(formError.schemaOption.required ? { error: true } : {})}
          >
            <InputLabel htmlFor="schema-option">{getText(i18nKeys.ADD_STUDY_DIALOG__CDM_SCHEMA_OPTION)}</InputLabel>
            <Select
              sx={styles}
              value={formData.schemaOption}
              onChange={(event: SelectChangeEvent<string>) =>
                handleFormDataChange({
                  schemaOption: event.target.value,
                  cdmSchemaValue: "",
                  isSameCdmSchemaForVocab: false,
                  vocabSchemaValue: "",
                  databaseCode: "",
                  dialect: "",
                })
              }
              inputProps={{
                name: "schemaOption",
                id: "schema-option",
              }}
            >
              <MenuItem sx={styles} value="">
                &nbsp;
              </MenuItem>
              {SchemaOptions?.map((option) => (
                <MenuItem sx={styles} key={option.type} value={option.type}>
                  {option.title}
                </MenuItem>
              ))}
            </Select>
            {formError.schemaOption.required && (
              <FormHelperText>{getText(i18nKeys.ADD_STUDY_DIALOG__REQUIRED)}</FormHelperText>
            )}
          </FormControl>
        </Box>

        {/* DB Input */}
        {displayDatabases && (
          <Box mb={4}>
            <FormControl
              sx={styles}
              className="select"
              variant="standard"
              fullWidth
              {...(formError.databaseCode.required ? { error: true } : {})}
            >
              <InputLabel htmlFor="data-model-option">{getText(i18nKeys.ADD_STUDY_DIALOG__DATABASES)}</InputLabel>
              <Select
                sx={styles}
                value={formData.databaseCode}
                onChange={(event: SelectChangeEvent<string>) => {
                  const db = databases.find((db) => db.code === event.target.value);

                  handleFormDataChange({
                    databaseCode: db?.code || "",
                    dialect: db?.dialect || "",
                    cdmSchemaValue: "",
                    vocabSchemaValue: "",
                  });
                }}
                inputProps={{
                  name: "databaseOption",
                  id: "data-base-option",
                }}
              >
                <MenuItem sx={styles} value="">
                  &nbsp;
                </MenuItem>
                {databases?.map((db) => (
                  <MenuItem sx={styles} key={db.code} value={db.code}>
                    {db.code}-{db.dialect}
                  </MenuItem>
                ))}
              </Select>
              {formError.databaseCode.required && (
                <FormHelperText>{getText(i18nKeys.ADD_STUDY_DIALOG__REQUIRED)}</FormHelperText>
              )}
            </FormControl>
          </Box>
        )}

        {/* Custom Schema Input */}
        {displaySchemaNameInput && formData.schemaOption === SchemaTypes.ExistingCDM ? (
          <Box mb={4}>
            <TextField
              fullWidth
              variant="standard"
              label={getText(i18nKeys.ADD_STUDY_DIALOG__SCHEMA_NAME)}
              value={formData.cdmSchemaValue}
              onChange={(event) => handleFormDataChange({ cdmSchemaValue: event.target.value })}
              error={formError.cdmSchemaValue.required}
            />
            {formError.cdmSchemaValue.required && (
              <FormHelperText error={true}>{getText(i18nKeys.ADD_STUDY_DIALOG__REQUIRED)}</FormHelperText>
            )}
          </Box>
        ) : (
          formData.schemaOption === SchemaTypes.CustomCDM && (
            <Box mb={4}>
              <Autocomplete
                freeSolo
                sx={styles}
                id="autocomplete-schemas"
                options={schemas}
                renderInput={(params) => <TextField {...params} label="Schemas" variant="standard" />}
                value={formData?.cdmSchemaValue}
                onChange={(_: SyntheticEvent<Element, Event>, cdmSchemaValue: string | string[] | null) =>
                  handleFormDataChange({ cdmSchemaValue })
                }
                disabled={schemas.length === 0}
              />
              {schemas.length === 0 && (
                <FormHelperText error={true}>{getText(i18nKeys.ADD_STUDY_DIALOG__NO_AVAILABLE_SCHEMA)}</FormHelperText>
              )}
              {formError.cdmSchemaValue.required && (
                <FormHelperText error={true}>{getText(i18nKeys.ADD_STUDY_DIALOG__INVALID_SCHEMA_NAME)}</FormHelperText>
              )}
            </Box>
          )
        )}

        {displaySameCdmVocabSchemaCheckbox && (
          <Box mb={4}>
            <Checkbox
              checked={formData.isSameCdmSchemaForVocab}
              checkbox-id="is-same-cdm-schema-for-vocab-checkbox"
              label={getText(i18nKeys.ADD_STUDY_DIALOG__USE_SAME_SCHEMA)}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const isSameCdmSchemaForVocab = event.target.checked;
                handleFormDataChange(
                  isSameCdmSchemaForVocab
                    ? { vocabSchemaValue: "", isSameCdmSchemaForVocab }
                    : { isSameCdmSchemaForVocab }
                );
              }}
            />
          </Box>
        )}

        {/* Vocab Schema Dropdown */}
        {displayVocabSchemaDropdown ? (
          <Box mb={4}>
            <FormControl
              sx={styles}
              className="select"
              variant="standard"
              fullWidth
              {...(formError.vocabSchemaValue.required ? { error: true } : {})}
            >
              <InputLabel htmlFor="vocab-schema-option">
                {getText(i18nKeys.ADD_STUDY_DIALOG__VOCAB_SCHEMA_NAME)}
              </InputLabel>
              <Select
                sx={styles}
                value={formData.vocabSchemaValue}
                onChange={(event: SelectChangeEvent<string>) =>
                  handleFormDataChange({ vocabSchemaValue: event.target.value })
                }
                inputProps={{
                  name: "vocabSchemaOption",
                  id: "vocab-schema-option",
                }}
              >
                <MenuItem sx={styles} value="">
                  &nbsp;
                </MenuItem>
                {vocabSchemas[formData.databaseCode]?.map((vocabSchema) => (
                  <MenuItem sx={styles} key={vocabSchema} value={vocabSchema}>
                    {vocabSchema}
                  </MenuItem>
                ))}
              </Select>
              {formError.vocabSchemaValue.required && (
                <FormHelperText>{getText(i18nKeys.ADD_STUDY_DIALOG__REQUIRED)}</FormHelperText>
              )}
            </FormControl>
          </Box>
        ) : (
          // Custom Vocab Schema Input
          displayVocabSchemaInput && (
            <Box mb={4}>
              <TextField
                fullWidth
                variant="standard"
                label={getText(i18nKeys.ADD_STUDY_DIALOG__VOCAB_SCHEMA_NAME)}
                value={formData.vocabSchemaValue}
                onChange={(event) => handleFormDataChange({ vocabSchemaValue: event.target.value })}
                error={formError.vocabSchemaValue.required}
              />
              {formError.vocabSchemaValue.required && (
                <FormHelperText error={true}>{getText(i18nKeys.ADD_STUDY_DIALOG__REQUIRED)}</FormHelperText>
              )}
            </Box>
          )
        )}

        {/* Data Model Options */}
        {displayDataModels && (
          <Box mb={4}>
            <FormControl
              sx={styles}
              className="select"
              variant="standard"
              fullWidth
              {...(formError.dataModel.required ? { error: true } : {})}
            >
              <InputLabel htmlFor="data-model-option">
                {getText(i18nKeys.ADD_STUDY_DIALOG__DATA_MODEL_OPTION)}
              </InputLabel>
              <Select
                sx={styles}
                value={formData.dataModel}
                onChange={(event: SelectChangeEvent<string>) => handleFormDataChange({ dataModel: event.target.value })}
                inputProps={{
                  name: "dataModelOption",
                  id: "data-model-option",
                }}
              >
                <MenuItem sx={styles} value="">
                  &nbsp;
                </MenuItem>
                {dataModels?.map((model) => (
                  <MenuItem sx={styles} key={model.name} value={model.name}>
                    {model.name}
                  </MenuItem>
                ))}
              </Select>
              {formError.dataModel.required && (
                <FormHelperText>{getText(i18nKeys.ADD_STUDY_DIALOG__REQUIRED)}</FormHelperText>
              )}
            </FormControl>
          </Box>
        )}
        <Box mb={4}>
          <FormControl
            sx={styles}
            className="select"
            variant="standard"
            fullWidth
            {...(formError.paConfigId.required ? { error: true } : {})}
          >
            <InputLabel htmlFor="pa-config-option">{getText(i18nKeys.ADD_STUDY_DIALOG__PA_CONFIG)}</InputLabel>
            <Select
              sx={styles}
              value={formData.paConfigId}
              onChange={(event: SelectChangeEvent<string>) => handleFormDataChange({ paConfigId: event.target.value })}
              inputProps={{
                name: "paConfigOption",
                id: "pa-config-option",
              }}
            >
              <MenuItem sx={styles} value="">
                &nbsp;
              </MenuItem>
              {paConfigs?.map((config) => (
                <MenuItem sx={styles} key={config.configId} value={config.configId}>
                  {config.configName}
                </MenuItem>
              ))}
            </Select>
            {formError.paConfigId.required && (
              <FormHelperText>{getText(i18nKeys.ADD_STUDY_DIALOG__REQUIRED)}</FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box mb={4}>
          <TextField
            fullWidth
            variant="standard"
            label={getText(i18nKeys.ADD_STUDY_DIALOG__TYPE)}
            value={formData.type}
            onChange={(event) => handleFormDataChange({ type: event.target.value })}
          />
        </Box>
        <Box mb={4}>
          <TextField
            fullWidth
            variant="standard"
            label={getText(i18nKeys.ADD_STUDY_DIALOG__TOKEN_DATASET_CODE)}
            value={formData.tokenStudyCode}
            onChange={(event) => handleFormDataChange({ tokenStudyCode: event.target.value })}
            error={formError.tokenStudyCode.required || formError.tokenStudyCode.valid}
          />
          {formError.tokenStudyCode.required && (
            <FormHelperText error={true}>{getText(i18nKeys.ADD_STUDY_DIALOG__REQUIRED)}</FormHelperText>
          )}
          {formError.tokenStudyCode.valid && (
            <FormHelperText error={true}>{getText(i18nKeys.ADD_STUDY_DIALOG__ENTER_VALID_DATASET_CODE)}</FormHelperText>
          )}
          <FormHelperText>{getText(i18nKeys.ADD_STUDY_DIALOG__DATASET_CODE_ALLOWED_VALUES)}</FormHelperText>
        </Box>
        {formData?.schemaOption !== "" && formData?.schemaOption !== SchemaTypes.NoCDM && (
          <div>
            <Checkbox
              checked={formData.cleansedSchemaOption}
              checkbox-id="isCreateCleansedSchemaOptionSelected"
              label={getText(i18nKeys.ADD_STUDY_DIALOG__CREATE_DATA_CLEANSING)}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                handleFormDataChange({ cleansedSchemaOption: event.target.checked });
              }}
            />
          </div>
        )}

        <Box mb={4}>
          <Box fontWeight="bold">{getText(i18nKeys.ADD_STUDY_DIALOG__METADATA)}</Box>
          {attributeConfigs.length !== 0 &&
            studyMetadata.map((data, index) => (
              <MetadataForm
                key={index}
                studyMetadata={data}
                index={index}
                attributeConfigs={attributeConfigs}
                handleRemoveMetadata={() => handleRemoveLine(index, studyMetadata, setStudyMetadata)}
                handleMetadataChange={handleMetadataChange}
                error={formMetadataErrorIndex.includes(index)}
              />
            ))}
          <IconButton
            startIcon={<AddSquareIcon />}
            title={getText(i18nKeys.ADD_STUDY_DIALOG__ADD_METADATA)}
            onClick={handleAddMetadataForm}
          />
        </Box>

        <Box fontWeight="bold">{getText(i18nKeys.ADD_STUDY_DIALOG__TAGS)}</Box>
        <Box mb={4}>
          <Autocomplete
            multiple
            sx={styles}
            id="autocomplete-tags"
            options={tagConfigs}
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
              ))
            }
            renderInput={(params) => <TextField {...params} variant="standard" />}
            value={studyTagsData}
            onChange={handleTagChange}
          />
        </Box>

        <Box mb={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">{getText(i18nKeys.ADD_STUDY_DIALOG__DATA_VISIBILITY)}</FormLabel>
            <RadioGroup
              name={getText(i18nKeys.ADD_STUDY_DIALOG__VISIBILITY_STATUS_GROUP)}
              value={formData.visibilityStatus}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                handleFormDataChange({ visibilityStatus: event.target.value });
              }}
            >
              <FormControlLabel value="PUBLIC" control={<Radio />} label={getText(i18nKeys.ADD_STUDY_DIALOG__PUBLIC)} />
              <FormControlLabel
                value="DEFAULT"
                control={<Radio />}
                label={getText(i18nKeys.ADD_STUDY_DIALOG__PRIVATE)}
              />
              <FormControlLabel value="HIDDEN" control={<Radio />} label={getText(i18nKeys.ADD_STUDY_DIALOG__HIDDEN)} />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box mb={4}>
          <Box fontWeight="bold" mb={1}>
            {getText(i18nKeys.ADD_STUDY_DIALOG__DASHBOARD)}
          </Box>
          {dashboards.length !== 0 &&
            dashboards.map((data, index) => (
              <DashboardForm
                key={index}
                index={index}
                dashboard={data}
                onRemove={() =>
                  setDashboards([...dashboards.slice(0, index), ...dashboards.slice(index + 1, dashboards.length)])
                }
                onChange={(name: string, url: string, basePath: string) =>
                  setDashboards([
                    ...dashboards.slice(0, index),
                    {
                      ...dashboards[index],
                      name,
                      url,
                      basePath,
                    },
                    ...dashboards.slice(index + 1, dashboards.length),
                  ])
                }
                error={dashboardErrorIndex[index]}
              />
            ))}
          <Box mt={2}>
            <IconButton
              startIcon={<AddSquareIcon />}
              title={getText(i18nKeys.ADD_STUDY_DIALOG__ADD_DASHBOARD)}
              onClick={() => setDashboards([...dashboards, EMPTY_DASHBOARD_FORM_DATA])}
            />
          </Box>
        </Box>
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button
          text={getText(i18nKeys.ADD_STUDY_DIALOG__CANCEL)}
          onClick={() => handleClose("cancelled")}
          variant="outlined"
          block
          disabled={loading}
        />
        <Button text={getText(i18nKeys.ADD_STUDY_DIALOG__ADD)} onClick={handleSubmit} block loading={loading} />
      </div>
    </Dialog>
  );
};

export default AddStudyDialog;
