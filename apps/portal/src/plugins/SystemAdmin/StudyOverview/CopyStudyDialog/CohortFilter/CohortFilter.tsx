import React, { FC } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { SxProps } from "@mui/system";
import { Loader, ChevronDownIcon } from "@portal/components";
import Alert from "@mui/material/Alert";

import { CohortMapping } from "../../../../../types";
import "./CohortFilter.scss";

const selectStyles: SxProps = {
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#979797",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    },
  },
};
const menuPropsStyles: SxProps = {
  PaperProps: {
    sx: {
      borderTopLeftRadius: "0px",
      borderTopRightRadius: "0px",
      border: "1px solid #979797",
      "& .MuiMenuItem-root": {
        paddingLeft: 2,
      },
    },
  },
};

interface CohortFilterProps {
  cohortDefinitionId: string;
  cohortDefinitionList?: CohortMapping[];
  handleCohortDefinitionChange: (value: string) => void;
  loading: boolean;
  error: string;
}

const CohortFilter: FC<CohortFilterProps> = ({
  cohortDefinitionId,
  cohortDefinitionList,
  handleCohortDefinitionChange,
  loading,
  error,
}) => {
  if (!cohortDefinitionList || loading) {
    return <Loader text={"Loading Cohort Definitions..."}></Loader>;
  }

  if (error) {
    return (
      <Alert severity="error" className="alert">
        {error}
      </Alert>
    );
  }

  if (cohortDefinitionList.length === 0) {
    return (
      <Alert severity="warning" className="alert">
        No cohorts found in study
      </Alert>
    );
  }

  return (
    <FormControl variant="outlined" className="cohort-filter-form" fullWidth>
      <InputLabel id="select-cohort-definition" className="input-label">
        Select cohort filter
      </InputLabel>
      <Select
        sx={selectStyles}
        MenuProps={menuPropsStyles}
        label="Select cohort filter"
        labelId="select-cohort-filter"
        className="select"
        IconComponent={ChevronDownIcon}
        onChange={(event) => handleCohortDefinitionChange(event.target.value)}
        value={cohortDefinitionId}
      >
        {cohortDefinitionList.map((cohort: CohortMapping) => (
          <MenuItem className="menu-item" value={cohort.id} key={cohort.id}>
            Cohort {cohort.id}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CohortFilter;
