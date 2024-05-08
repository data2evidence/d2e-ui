import React, { FC, useCallback } from "react";
import { Select, SelectChangeEvent, SelectProps } from "@portal/components";
import { MenuItem } from "@mui/material";
import { useDatasets } from "../../../hooks";
import { useActiveDataset, useTranslation } from "../../../contexts";

interface SelectDatasetProps extends Omit<SelectProps, "onChange"> {
  onChange?: (datasetId: string) => void;
}

export const SelectDataset: FC<SelectDatasetProps> = ({ onChange, ...props }) => {
  const { getText, i18nKeys } = useTranslation();
  const [datasets, loading] = useDatasets("researcher");
  const { activeDataset, setActiveDatasetId, setActiveDatasetName } = useActiveDataset();

  const getDatasetName = useCallback(
    (datasetId: string) => {
      const d = datasets.find((dataset) => dataset["id"] == datasetId);
      return d?.studyDetail?.name || "Untitled";
    },
    [datasets]
  );

  const handleChange = useCallback(
    (datasetId: string) => {
      setActiveDatasetId(datasetId);
      setActiveDatasetName(getDatasetName(datasetId));
      typeof onChange === "function" && onChange(datasetId);
    },
    [onChange, getDatasetName, setActiveDatasetId, setActiveDatasetName]
  );

  if (datasets.length === 0) return null;

  return (
    <Select
      className="select-dataset"
      variant="outlined"
      sx={{
        minWidth: "100px",
        maxWidth: "200px",
        borderRadius: "6px",
        backgroundColor: "#000080",
        color: "white",
        ".MuiSelect-select": {
          padding: "8px 14px",
        },
        ".MuiSvgIcon-root": { fill: "white" },
      }}
      value={activeDataset.id}
      onChange={(e: SelectChangeEvent) => handleChange(e.target.value)}
      disabled={loading}
      displayEmpty
      {...props}
    >
      <MenuItem value="" disabled>
        {getText(i18nKeys.INFORMATION__SELECT_DATASET)}
      </MenuItem>
      {datasets.map((ds) => (
        <MenuItem key={ds.id} value={ds.id}>
          {ds.studyDetail?.name || "Untitled"}
        </MenuItem>
      ))}
    </Select>
  );
};
