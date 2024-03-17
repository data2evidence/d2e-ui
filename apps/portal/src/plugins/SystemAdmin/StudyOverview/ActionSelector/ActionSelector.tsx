import React, { FC, useCallback } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material/Select";
import { FormControl } from "@mui/material";
import { Study } from "../../../../types";
import { SxProps } from "@mui/system";
import { useUserInfo } from "../../../../contexts/UserContext";

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
}

interface Action {
  name: string;
  value: string;
}

const actionsList: Action[] = [
  { name: "Update dataset", value: "metadata" },
  { name: "Create data mart", value: "version" },
  { name: "Permissions", value: "permissions" },
  { name: "Resources", value: "resources" },
  { name: "Update schema", value: "update" },
  { name: "Delete dataset", value: "delete" },
  { name: "Create release", value: "release" },
];

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
}) => {
  const { user } = useUserInfo();
  const isUserAdmin = user.isUserAdmin;

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
      study,
    ]
  );

  const disableUpdateSelect = useCallback(
    (actionVal: string) => {
      if (actionVal !== "update" || isSchemaUpdatable) {
        if (actionVal === "permissions" && !isUserAdmin) {
          return true;
        }
        return false;
      }
      return true;
    },
    [isSchemaUpdatable, isUserAdmin]
  );

  return (
    <FormControl sx={styles}>
      <Select value="" onChange={handleActionChange} displayEmpty sx={styles}>
        <MenuItem value="" sx={styles} disableRipple>
          Select action
        </MenuItem>
        {actionsList.map((action: Action) => (
          <MenuItem
            value={action.value}
            key={action.value}
            sx={styles}
            disableRipple
            disabled={disableUpdateSelect(action.value)}
          >
            {action.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ActionSelector;
