import React, { ChangeEvent, FC, useCallback } from "react";
import { Box, IconButton, TextField, TrashIcon } from "@portal/components";
import { DatasetDashboard } from "../../../../../types";
import { FormHelperText } from "@mui/material";
import { TranslationContext } from "../../../../../contexts/TranslationContext";

interface DashboardFormProps {
  index: number;
  dashboard: DatasetDashboard | undefined;
  onRemove: () => void;
  onChange: (name: string, url: string, basePath: string) => void;
  error?: DashboardFormError;
}

export interface DashboardFormError {
  name: {
    required: boolean;
  };
  url: {
    required: boolean;
  };
  basePath: {
    required: boolean;
  };
}

export const EMPTY_DASHBOARD_FORM_ERROR: DashboardFormError = {
  name: { required: false },
  url: { required: false },
  basePath: { required: false },
};

export const EMPTY_DASHBOARD_FORM_DATA: DatasetDashboard = { name: "", url: "", basePath: "" };

export const DashboardForm: FC<DashboardFormProps> = ({ index, dashboard, onRemove, onChange, error }) => {
  const { getText, i18nKeys } = TranslationContext();
  const handleChange = useCallback(
    (changes: Partial<DatasetDashboard>) => {
      const update = { ...dashboard, ...changes } as DatasetDashboard;
      typeof onChange === "function" && onChange(update.name, update.url, update.basePath);
    },
    [dashboard, onChange]
  );

  return (
    <Box display="flex" alignItems="flex-end" gap={2}>
      <Box sx={{ width: "200px", height: index === 0 ? "70px" : "60px" }}>
        <TextField
          fullWidth
          variant="standard"
          {...(index === 0 ? { label: "Name" } : { placeholder: "Name" })}
          value={dashboard?.name}
          error={error?.name.required}
          onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange({ name: event.target.value })}
        />
        {error?.name.required && (
          <FormHelperText className="form-error">{getText(i18nKeys.DASHBOARD_FORM__REQUIRED)}</FormHelperText>
        )}
      </Box>
      <Box flex="1" sx={{ height: index === 0 ? "70px" : "60px" }}>
        <TextField
          fullWidth
          variant="standard"
          {...(index === 0 ? { label: "URL" } : { placeholder: "URL" })}
          value={dashboard?.url}
          error={error?.url.required}
          onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange({ url: event.target.value })}
        />
        {error?.url.required && (
          <FormHelperText className="form-error">{getText(i18nKeys.DASHBOARD_FORM__REQUIRED)}</FormHelperText>
        )}
      </Box>
      <Box sx={{ width: "150px", height: index === 0 ? "70px" : "60px" }}>
        <TextField
          fullWidth
          variant="standard"
          {...(index === 0 ? { label: "Base path" } : { placeholder: "Base path" })}
          value={dashboard?.basePath}
          error={error?.basePath.required}
          onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange({ basePath: event.target.value })}
        />
        {error?.basePath.required && (
          <FormHelperText className="form-error">{getText(i18nKeys.DASHBOARD_FORM__REQUIRED)}</FormHelperText>
        )}
      </Box>
      <Box flex="none" sx={{ height: "60px" }}>
        <IconButton startIcon={<TrashIcon />} onClick={() => onRemove()} />
      </Box>
    </Box>
  );
};
