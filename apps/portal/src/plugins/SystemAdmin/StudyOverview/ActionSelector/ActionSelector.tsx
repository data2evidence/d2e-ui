import React, { FC, useCallback } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material/Select";
import { FormControl } from "@mui/material";
import { Study } from "../../../../types";
import { SxProps } from "@mui/system";
import { useTranslation, useUser } from "../../../../contexts";

interface ActionSelectorProps {
  study: Study;
  isSchemaUpdatable: boolean | undefined;
  handleCopyStudy: (study: Study) => void;
  handleDeleteStudy: (study: Study) => void;
  handleMetadata: (study: Study) => void;
  handleResources: (study: Study) => void;
  handlePermissions: (study: Study) => void;
  handleUpdate: (study: Study) => void;
  handleRelease: (study: Study) => void;
  handleDataQuality: (study: Study) => void;
  handleDataCharacterization: (study: Study) => void;
}

interface Action {
  name: string;
  value: string;
}

const styles: SxProps = {
  color: "#000080",
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
    "&::after, &:hover:not(.Mui-disabled)::before": {
      borderBottom: "2px solid #000080",
    },
  },
  "&.MuiMenuItem-root:hover": {
    backgroundColor: "#ebf2fa",
  },
};

const ActionSelector: FC<ActionSelectorProps> = ({
  study,
  isSchemaUpdatable,
  handleDeleteStudy,
  handleCopyStudy,
  handleMetadata,
  handleResources,
  handlePermissions,
  handleUpdate,
  handleRelease,
  handleDataQuality,
  handleDataCharacterization,
}) => {
  const { getText, i18nKeys } = useTranslation();
  const { user } = useUser();
  const isUserAdmin = user.isUserAdmin;

  const actionsList: Action[] = [
    { name: getText(i18nKeys.ACTION_SELECTOR__UPDATE_DATASET), value: "metadata" },
    { name: getText(i18nKeys.ACTION_SELECTOR__CREATE_DATA_MART), value: "version" },
    { name: getText(i18nKeys.ACTION_SELECTOR__PERMISSIONS), value: "permissions" },
    { name: getText(i18nKeys.ACTION_SELECTOR__RESOURCES), value: "resources" },
    { name: getText(i18nKeys.ACTION_SELECTOR__UPDATE_SCHEMA), value: "update" },
    { name: getText(i18nKeys.ACTION_SELECTOR__DELETE_DATASET), value: "delete" },
    { name: getText(i18nKeys.ACTION_SELECTOR__CREATE_RELEASE), value: "release" },
    { name: getText(i18nKeys.ACTION_SELECTOR__RUN_DATA_QUALITY), value: "data-quality" },
    { name: getText(i18nKeys.ACTION_SELECTOR__RUN_DATA_CHARACTERIZATION), value: "data-characterization" },
  ];

  const handleActionChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      switch (event.target.value) {
        case "version":
          handleCopyStudy(study);
          break;
        case "permissions":
          handlePermissions(study);
          break;
        case "metadata":
          handleMetadata(study);
          break;
        case "resources":
          handleResources(study);
          break;
        case "delete":
          handleDeleteStudy(study);
          break;
        case "update":
          handleUpdate(study);
          break;
        case "release":
          handleRelease(study);
          break;
        case "data-quality":
          handleDataQuality(study);
          break;
        case "data-characterization":
          handleDataCharacterization(study);
          break;
        default:
          break;
      }
    },
    [
      handleDeleteStudy,
      handleCopyStudy,
      handleMetadata,
      handleResources,
      handlePermissions,
      handleUpdate,
      handleRelease,
      handleDataQuality,
      handleDataCharacterization,
      study,
    ]
  );

  const isDisabled = useCallback(
    (actionVal: string) => {
      if (actionVal !== "update" || isSchemaUpdatable) {
        if (actionVal === "permissions" && !isUserAdmin) {
          return true;
        }
        if (study.dialect === "postgres" && actionVal === "release") {
          return true;
        }
        if (actionVal === "version" && !study.schemaName) {
          return true;
        }
        return false;
      }
      return true;
    },
    [isSchemaUpdatable, isUserAdmin, study]
  );

  return (
    <FormControl sx={styles}>
      <Select value="" onChange={handleActionChange} displayEmpty sx={styles}>
        <MenuItem value="" sx={styles} disableRipple>
          {getText(i18nKeys.ACTION_SELECTOR__SELECT_ACTION)}
        </MenuItem>
        {actionsList.map((action: Action) => (
          <MenuItem
            value={action.value}
            key={action.value}
            sx={styles}
            disableRipple
            disabled={isDisabled(action.value)}
          >
            {action.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ActionSelector;
