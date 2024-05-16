import { Checkbox, FormControl, InputLabel, Select, SelectChangeEvent, TextField } from "@portal/components";
import classNames from "classnames";
import React, { FC, useCallback, ChangeEvent } from "react";
import "./ParamsField.scss";
import JSONEditor from "../JSONEditor/JSONEditor";
import { MenuItem, SxProps } from "@mui/material";

interface ParamsFieldProps {
  param: Record<string, any>;
  paramKey: string;
  handleInputChange: (value: any, name: string, parent?: string, child?: string) => void;
  formData: Record<string, any>;
  parentKey?: string;
  childKey?: string;
}

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

const ParamsField: FC<ParamsFieldProps> = ({ param, paramKey, handleInputChange, formData, parentKey, childKey }) => {
  const hasProperties = param.properties;

  const getLabel = useCallback((param: Record<string, any>) => {
    if (!param.required) {
      return `${param.title} (Optional)`;
    } else {
      return param.title;
    }
  }, []);

  const renderInput = useCallback(() => {
    if (!param.properties) {
      return inputType(param);
    } else {
      return Object.keys(param.properties).map((p) => (
        <ParamsField
          param={param.properties[p]}
          paramKey={p}
          key={p}
          handleInputChange={handleInputChange}
          formData={formData}
          parentKey={parentKey || paramKey}
          childKey={parentKey ? paramKey : ""}
        />
      ));
    }
  }, [param]);

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
          <FormControl fullWidth sx={styles} className="select" variant="standard">
            <InputLabel>{paramKey}</InputLabel>
            <Select
              sx={styles}
              value={getValue()}
              onChange={(event: SelectChangeEvent) =>
                handleInputChange(event.target.value, paramKey, parentKey, childKey)
              }
            >
              {param.enum.map((option: string) => (
                <MenuItem sx={styles} key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
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
            />
          </FormControl>
        );
      }
      if (param.type === "object" || param.type === "array") {
        return (
          <>
            {paramKey}
            <JSONEditor
              value={getValue()}
              onChange={handleInputChange}
              parentKey={parentKey}
              childKey={childKey}
              name={paramKey}
            />
          </>
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
              onChange={(event) => handleInputChange(event.target.value, paramKey, parentKey, childKey)}
              defaultValue={getValue()}
              name={paramKey}
              type={"number"}
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
            />
          </FormControl>
        );
      }
    },
    [param, getValue]
  );

  return (
    <div className={classNames("params-field", { "params-field-properties": hasProperties })}>
      {hasProperties && paramKey}
      <div className="u-padding-vertical--normal">{renderInput()}</div>
    </div>
  );
};

export default ParamsField;
