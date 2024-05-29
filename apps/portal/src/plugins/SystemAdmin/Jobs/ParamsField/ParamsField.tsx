import React, { FC, useCallback, ChangeEvent, useMemo } from "react";
import { Checkbox, FormControl, InputLabel, Select, SelectChangeEvent, TextField } from "@portal/components";
import { FormHelperText, MenuItem, SxProps } from "@mui/material";
import { useTranslation } from "../../../../contexts";
import JSONEditor from "../JSONEditor/JSONEditor";

interface ParamsFieldProps {
  param: Record<string, any>;
  paramKey: string;
  handleInputChange: (value: any, name: string, parent?: string, child?: string) => void;
  errors: string[];
  formData: Record<string, any>;
  parentKey?: string;
  childKey?: string;
}

const styles: SxProps = {
  color: "#000080",
  "&::after, &:hover:not(.Mui-disabled)::before": {
    borderBottom: "2px solid #000080",
  },
  ".MuiInput-input:focus": {
    backgroundColor: "transparent",
  },
  "&.MuiMenuItem-root:hover": {
    backgroundColor: "#ebf2fa",
  },
};

const ParamsField: FC<ParamsFieldProps> = ({
  param,
  paramKey,
  handleInputChange,
  formData,
  parentKey,
  childKey,
  errors,
}) => {
  const { getText, i18nKeys } = useTranslation();

  const hasError = useMemo(() => errors.includes(paramKey), [errors]);

  const getLabel = useCallback((param: Record<string, any>) => {
    if (!param.required) {
      return `${param.title} (Optional)`;
    } else {
      return param.title;
    }
  }, []);

  const getValue = useCallback(() => {
    if (parentKey) {
      if (childKey) return formData[parentKey][childKey][paramKey];
      return formData[parentKey][paramKey];
    }
    return formData[paramKey];
  }, [formData]);

  const inputType = useCallback(
    (param: Record<string, any>) => {
      if (param.type === "enum" || param.enum) {
        return (
          <FormControl fullWidth sx={styles} className="select" variant="standard" error={hasError}>
            <InputLabel>{paramKey}</InputLabel>
            <Select
              sx={styles}
              value={getValue()}
              onChange={(event: SelectChangeEvent) =>
                handleInputChange(event.target.value, paramKey, parentKey, childKey)
              }
              error={hasError}
            >
              {param.enum.map((option: string) => (
                <MenuItem sx={styles} key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {hasError && <FormHelperText>{getText(i18nKeys.EXECUTE_FLOW_DIALOG__REQUIRED)}</FormHelperText>}
          </FormControl>
        );
      }
      if (!param.type || param.type === "string") {
        return (
          <FormControl fullWidth>
            <TextField
              variant="standard"
              label={getLabel(param)}
              onChange={(event) => handleInputChange(event.target.value, paramKey, parentKey, childKey)}
              defaultValue={getValue()}
              name={paramKey}
              error={hasError}
              helperText={hasError && getText(i18nKeys.EXECUTE_FLOW_DIALOG__REQUIRED)}
            />
          </FormControl>
        );
      }
      if (param.type === "object" || param.type === "array") {
        return (
          <JSONEditor
            value={getValue()}
            onChange={handleInputChange}
            parentKey={parentKey}
            childKey={childKey}
            name={paramKey}
          />
        );
      }
      if (param.type === "boolean") {
        return (
          <Checkbox
            label={getLabel(param)}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              handleInputChange(event.target.checked, paramKey, parentKey, childKey);
            }}
            checked={!!getValue()}
          />
        );
      }

      if (param.type === "integer") {
        return (
          <FormControl fullWidth>
            <TextField
              variant="standard"
              label={getLabel(param)}
              onChange={(event) => handleInputChange(parseInt(event.target.value), paramKey, parentKey, childKey)}
              defaultValue={getValue()}
              name={paramKey}
              type={"number"}
              error={hasError}
              helperText={hasError && getText(i18nKeys.EXECUTE_FLOW_DIALOG__REQUIRED)}
            />
          </FormControl>
        );
      } else {
        return (
          <FormControl fullWidth>
            <TextField
              variant="standard"
              label={getLabel(param)}
              onChange={(event) => handleInputChange(event.target.value, paramKey, parentKey, childKey)}
              defaultValue={getValue()}
              name={paramKey}
              error={hasError}
              helperText={hasError && getText(i18nKeys.EXECUTE_FLOW_DIALOG__REQUIRED)}
            />
          </FormControl>
        );
      }
    },
    [param, getValue, hasError]
  );

  return (
    <div className="params-field">
      <div className="u-padding-vertical--normal">
        {param.properties
          ? Object.keys(param.properties).map((p) => (
              <ParamsField
                param={param.properties[p]}
                paramKey={p}
                key={p}
                handleInputChange={handleInputChange}
                formData={formData}
                parentKey={parentKey || paramKey}
                childKey={parentKey ? paramKey : ""}
                errors={errors}
              />
            ))
          : inputType(param)}
      </div>
    </div>
  );
};

export default ParamsField;
