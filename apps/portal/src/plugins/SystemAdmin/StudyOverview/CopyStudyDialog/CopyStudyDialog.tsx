import React, { ChangeEvent, FC, FormEvent, useCallback, useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { Button, Dialog, Checkbox } from "@portal/components";
import {
  CopyStudyInput,
  CopyStudyColumnMetadata,
  CopyStudyTableMetadata,
  SnapshotCopyConfig,
  Study,
  UsefulEvent,
  Feedback,
  CohortMapping,
  CloseDialogType,
} from "../../../../types";
import webComponentWrapper from "../../../../webcomponents/webComponentWrapper";
import "./CopyStudyDialog.scss";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Gateway } from "../../../../axios/gateway";

import CohortFilter from "./CohortFilter/CohortFilter";
import SchemaFilter from "./SchemaFilter/SchemaFilter";
interface CopyStudyDialogProps {
  study: Study | undefined;
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormData {
  name: string;
  date: string;
  snapshotLocation: string;
  copyStudySchemaMetadata: Array<CopyStudyTableMetadata>;
  cohortDefinitionId: string;
}

interface RootFilterSelection {
  isDateFilterSelected: boolean;
  isCohortFilterSelected: boolean;
  isTableFilterSelected: boolean;
}

const CopyStudyDialog: FC<CopyStudyDialogProps> = ({ study, open, onClose, loading, setLoading }) => {
  const [rootFilterCheckbox, setRootFilterCheckbox] = useState<RootFilterSelection>({
    isDateFilterSelected: false,
    isCohortFilterSelected: false,
    isTableFilterSelected: false,
  });
  const [cohortDefinitionList, setCohortDefinitionList] = useState<CohortMapping[]>([]);
  const [cohortDefinitionFetchError, setCohortDefinitionFetchError] = useState("");
  const [isFetchingCohortDefinition, setIsFetchingCohortDefinition] = useState(true);
  const [copyStudyMetadataFetchError, setCopyStudyMetadataFetchError] = useState("");
  const [isFetchingcopyStudyMetadata, setIsFetchingcopyStudyMetadata] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    date: dayjs().format("YYYY-MM-DD"),
    snapshotLocation: "",
    copyStudySchemaMetadata: [],
    cohortDefinitionId: "",
  });

  const fetchCopyStudyMetadata = useCallback(async () => {
    setIsFetchingcopyStudyMetadata(true);
    if (!study?.id) return;

    const gatewayAPI = new Gateway();

    try {
      // Get study metadata
      let result = await gatewayAPI.getCdmSchemaSnapshotMetadata(study.id);

      // Sort table names by alphabetical order
      result.schemaTablesMetadata = result.schemaTablesMetadata.sort(
        (a: CopyStudyTableMetadata, b: CopyStudyTableMetadata) => (a.tableName > b.tableName ? 1 : -1)
      );

      // Sort columns in tables based on selectability, e.g only those columns that can be selected are at the top and those columns e.g(PK, FK, NON_NULLABLE) are at the bottom
      result.schemaTablesMetadata = result.schemaTablesMetadata.map((tableMetadata: CopyStudyTableMetadata) => ({
        ...tableMetadata,
        tableColumnsMetadata: tableMetadata.tableColumnsMetadata
          .sort((a: CopyStudyColumnMetadata, b: CopyStudyColumnMetadata) =>
            (!a.isNullable || a.isPrimaryKey || a.isForeignKey) < (!b.isNullable || b.isPrimaryKey || b.isForeignKey)
              ? 1
              : -1
          )
          .reverse(),
      }));

      // create copystudyconfig object for tracking table and column checkbox selection
      result = result.schemaTablesMetadata.map((tableMetadata: any) => ({
        ...tableMetadata,
        tableColumnsMetadata: tableMetadata.tableColumnsMetadata.map((columnMetadata: any) => ({
          ...columnMetadata,
          isSelected: true,
        })),
        isSelected: true,
      }));
      setCopyStudyMetadataFetchError("");
      setFormData((prevState) => ({ ...prevState, copyStudySchemaMetadata: result }));
    } catch (err: any) {
      setCopyStudyMetadataFetchError("Error Study Schema Metadata, Please try refreshing page to load again");
    } finally {
      setIsFetchingcopyStudyMetadata(false);
    }
  }, [study]);

  const fetchCohortDefinitionList = useCallback(async () => {
    setIsFetchingCohortDefinition(true);
    if (!study?.id) return;

    const gatewayAPI = new Gateway();
    try {
      // Get cohort definition list
      const result = await gatewayAPI.getAllCohorts(study.id);
      setCohortDefinitionFetchError("");
      setCohortDefinitionList(result.data);
    } catch (err) {
      setCohortDefinitionFetchError("Error loading Cohort Definitions, Please try refreshing page to load again");
    } finally {
      setIsFetchingCohortDefinition(false);
    }
  }, [study]);

  useEffect(() => {
    fetchCopyStudyMetadata();
    fetchCohortDefinitionList();
  }, [fetchCopyStudyMetadata, fetchCohortDefinitionList]);

  const handleSnapshotLocationChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setFormData({ ...formData, snapshotLocation: event.target?.value || "" });
    },
    [formData]
  );

  const [feedback, setFeedback] = useState<Feedback>({});

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFeedback({});
      typeof onClose === "function" && onClose(type);
    },
    [onClose, setFeedback]
  );

  const nameRef = webComponentWrapper({
    handleInput: (event: UsefulEvent) => {
      event.preventDefault();
      setFormData({ ...formData, name: event.target.value });
    },
  });

  const handleRootFilterCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRootFilterCheckbox((prevState) => ({ ...prevState, [event.target.id]: event.target.checked }));
  };

  const handleTimestampChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setFormData({ ...formData, date: event.target?.value || "" });
    },
    [formData]
  );

  const handleCopyStudy = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!study?.id) return;

      if (formData.snapshotLocation === "") {
        setFeedback({
          type: "error",
          message: "Snapshot location required!",
        });
        return;
      }

      // If cohort filter checkbox is selected but no cohort was selected
      if (formData.cohortDefinitionId === "" && rootFilterCheckbox.isCohortFilterSelected) {
        setFeedback({
          type: "error",
          message: "Cohort Filter is checked, but no cohort was chosen!",
        });
        return;
      }

      // If table filter checkbox is selected but no table was selected
      if (
        formData.copyStudySchemaMetadata.filter((tableMetadata: CopyStudyTableMetadata) => tableMetadata.isSelected)
          .length === 0 &&
        rootFilterCheckbox.isTableFilterSelected
      ) {
        setFeedback({
          type: "error",
          message: "Table Filter is checked, but no table was chosen!",
        });
        return;
      }

      setFeedback({});
      const { name, date, snapshotLocation, copyStudySchemaMetadata, cohortDefinitionId } = formData;

      // Create snapshot copy config object
      const snapshotCopyConfig: SnapshotCopyConfig = {};
      // If date filter is selected, create timestamp for snapshot config
      if (rootFilterCheckbox.isDateFilterSelected) {
        snapshotCopyConfig.timestamp = `${date} 23:59:59`;
      }
      // If Table filter is selected, create tableConfig for snapshot config
      if (rootFilterCheckbox.isTableFilterSelected) {
        snapshotCopyConfig.tableConfig = copyStudySchemaMetadata
          .filter((tableMetadata: CopyStudyTableMetadata) => tableMetadata.isSelected)
          .map((tableMetadata: CopyStudyTableMetadata) => ({
            tableName: tableMetadata.tableName,
            columnsToBeCopied: tableMetadata.tableColumnsMetadata
              .filter((columnMetaData: CopyStudyColumnMetadata) => columnMetaData.isSelected)
              .map((columnMetaData: CopyStudyColumnMetadata) => columnMetaData.columnName),
          }));
      }
      // If Cohort filter is selected, create patientsToBeCopied for snapshot config
      if (rootFilterCheckbox.isCohortFilterSelected) {
        snapshotCopyConfig.patientsToBeCopied = cohortDefinitionList.filter(
          (cohort) => cohort.id == cohortDefinitionId
        )[0].patientIds;
      }

      const input: CopyStudyInput = {
        newStudyName: name,
        sourceStudyId: study.id,
        snapshotLocation: `${snapshotLocation}`,
      };
      // If snapshotCopyConfig is not empty, add to CopyStudyInput
      if (!(Object.keys(snapshotCopyConfig).length === 0)) {
        input.snapshotCopyConfig = snapshotCopyConfig;
      }

      try {
        setLoading(true);
        const gatewayAPI = new Gateway();
        await gatewayAPI.copyDataset(input);
        handleClose("success");
      } catch (err: any) {
        setFeedback({
          type: "error",
          message: err.data,
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, study, setLoading, handleClose, cohortDefinitionList, rootFilterCheckbox]
  );

  const handleCheckboxTableChange = (event: ChangeEvent<HTMLInputElement>) => {
    const tableName = event.target.id;
    const isChecked = event.target.checked;

    // If table name checkbox is checked, set tableMetadata isSelected and all corresponding columnMetadata in table isSelected to checkbox boolean value
    setFormData({
      ...formData,
      copyStudySchemaMetadata: formData.copyStudySchemaMetadata.map((tableMetadata: CopyStudyTableMetadata) => {
        if (tableMetadata.tableName === tableName) {
          return {
            ...tableMetadata,
            tableColumnsMetadata: tableMetadata.tableColumnsMetadata.map((columnMetadata: CopyStudyColumnMetadata) => {
              return {
                ...columnMetadata,
                // Set all columns in table's isSelected to checkbox checked value
                isSelected: isChecked,
              };
            }),
            // Set table isSelected to checkbox checked value
            isSelected: isChecked,
          };
        } else {
          return tableMetadata;
        }
      }),
    });
  };

  const handleCheckboxColumnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const [tableName, columnName] = event.target.id.split("-");
    const isChecked = event.target.checked;

    // If table name checkbox is checked, set tableMetadata isSelected and all corresponding columnMetadata in table isSelected to checkbox boolean value
    setFormData({
      ...formData,
      copyStudySchemaMetadata: formData.copyStudySchemaMetadata.map((tableMetadata: CopyStudyTableMetadata) => {
        if (tableMetadata.tableName === tableName) {
          return {
            ...tableMetadata,
            tableColumnsMetadata: tableMetadata.tableColumnsMetadata.map((columnMetadata: CopyStudyColumnMetadata) => {
              if (columnMetadata.columnName === columnName) {
                return {
                  ...columnMetadata,
                  // Set corresponding column in table isSelected to checkbox checked value
                  isSelected: isChecked,
                };
              } else {
                return columnMetadata;
              }
            }),
          };
        } else {
          return tableMetadata;
        }
      }),
    });
  };

  const handleCohortDefinitionChange = (value: string) => {
    setFormData((prevState) => ({ ...prevState, cohortDefinitionId: value }));
  };

  return (
    <Dialog
      className="copy-study-dialog"
      title={`Create data mart - ${study?.studyDetail?.name}`}
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
      feedback={feedback}
    >
      <Divider />
      <div className="copy-study-dialog__content">
        <form onSubmit={handleCopyStudy}>
          <div className="u-padding-vertical--normal">
            <d4l-input
              // @ts-ignore
              ref={nameRef}
              label="New dataset name"
              value={formData.name}
              required
            />
          </div>
          <div className="snapshotdate__filtergroup">
            <Checkbox
              checked={rootFilterCheckbox.isDateFilterSelected}
              checkbox-id={"isDateFilterSelected"}
              label={"Date Filter"}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                handleRootFilterCheckboxChange(event);
              }}
            />
            {rootFilterCheckbox.isDateFilterSelected && (
              <TextField
                variant="standard"
                id="date"
                type="date"
                value={formData.date}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleTimestampChange}
                disabled={!rootFilterCheckbox.isDateFilterSelected}
              />
            )}
          </div>
          <div className="u-padding-vertical--normal snapshotcohort__filtergroup">
            <Checkbox
              checked={rootFilterCheckbox.isCohortFilterSelected}
              checkbox-id={"isCohortFilterSelected"}
              label={"Cohort Filter"}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                handleRootFilterCheckboxChange(event);
              }}
            />
            {rootFilterCheckbox.isCohortFilterSelected && (
              <CohortFilter
                cohortDefinitionId={formData.cohortDefinitionId}
                cohortDefinitionList={cohortDefinitionList}
                handleCohortDefinitionChange={handleCohortDefinitionChange}
                loading={isFetchingCohortDefinition}
                error={cohortDefinitionFetchError}
              ></CohortFilter>
            )}
          </div>
          <div className="snapshotmetadata__filtergroup">
            <Checkbox
              checked={rootFilterCheckbox.isTableFilterSelected}
              checkbox-id={"isTableFilterSelected"}
              label={"Table Filter"}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                handleRootFilterCheckboxChange(event);
              }}
            />
            {rootFilterCheckbox.isTableFilterSelected && (
              <SchemaFilter
                copyStudySchemaMetadata={formData.copyStudySchemaMetadata}
                handleCheckboxTableChange={handleCheckboxTableChange}
                handleCheckboxColumnChange={handleCheckboxColumnChange}
                loading={isFetchingcopyStudyMetadata}
                error={copyStudyMetadataFetchError}
              ></SchemaFilter>
            )}
          </div>
          <div className="snapshotlocation__radiogroup">
            <FormControl component="fieldset">
              <FormLabel component="legend">Snapshot Location</FormLabel>
              <RadioGroup
                name="snapshotLocation"
                value={formData.snapshotLocation}
                onChange={handleSnapshotLocationChange}
              >
                <FormControlLabel value="DB" control={<Radio />} label="Store snapshots in DB" />
                <FormControlLabel value="PARQUET" control={<Radio />} label="Store snapshots as parquet file" />
              </RadioGroup>
            </FormControl>
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

export default CopyStudyDialog;
