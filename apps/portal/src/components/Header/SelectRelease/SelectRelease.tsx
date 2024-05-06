import React, { FC, useCallback } from "react";
import { Select, SelectChangeEvent, SelectProps } from "@portal/components";
import { MenuItem } from "@mui/material";
import { useDatasetReleases } from "../../../hooks";
import { useActiveDataset, useTranslation } from "../../../contexts";
import { DatasetRelease } from "../../../plugins/SystemAdmin/DQD/types";

interface SelectReleaseProps extends Omit<SelectProps, "onChange"> {
  onChange?: (datasetId: string) => void;
}

export const SelectRelease: FC<SelectReleaseProps> = ({ onChange, ...props }) => {
  const { getText, i18nKeys } = useTranslation();
  const { activeDataset, setActiveReleaseId } = useActiveDataset();
  const [releases, loading, error] = useDatasetReleases(activeDataset.id);

  const handleChange = useCallback(
    (datasetId: string) => {
      setActiveReleaseId(datasetId);
      typeof onChange === "function" && onChange(datasetId);
    },
    [onChange]
  );

  if (error) console.error(error?.message);
  if (releases.length === 0) return null;

  return (
    <Select
      className="select-release"
      variant="outlined"
      sx={{
        minWidth: "100px",
        borderRadius: "6px",
        ".MuiSelect-select": {
          padding: "8px 14px",
        },
        ".MuiOutlinedInput-notchedOutline": {
          borderColor: "#000080",
        },
      }}
      value={activeDataset.releaseId}
      onChange={(e: SelectChangeEvent) => handleChange(e.target.value)}
      disabled={loading}
      displayEmpty
      {...props}
    >
      <MenuItem value="" disabled>
        {getText(i18nKeys.INFORMATION__SELECT_RELEASE)}
      </MenuItem>
      {releases?.map((release: DatasetRelease) => (
        <MenuItem value={release.id} key={release.id}>
          {release.name} - {release.releaseDate}
        </MenuItem>
      ))}
    </Select>
  );
};
