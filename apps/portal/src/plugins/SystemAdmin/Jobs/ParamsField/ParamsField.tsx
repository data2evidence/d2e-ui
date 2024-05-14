import { FormControl, TextField } from "@portal/components";
import classNames from "classnames";
import React, { FC, useCallback, useState, useEffect, useMemo } from "react";
import "./ParamsField.scss";
import { useEventCallback } from "@mui/material";

interface ParamsFieldProps {
  param: Record<string, any>;
  paramKey: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, parent?: string) => void;
  formData: Record<string, any>;
  parentKey?: string;
}

const ParamsField: FC<ParamsFieldProps> = ({ param, paramKey, handleInputChange, formData, parentKey }) => {
  const hasProperties = param.properties;

  const getKey = useCallback(() => {
    if (parentKey) {
      return `[${parentKey}][${paramKey}]`;
    } else {
      return paramKey;
    }
  }, [parentKey, paramKey]);

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
          parentKey={getKey()}
        ></ParamsField>
      ));
    }
  }, [param]);

  const getValue = useCallback(() => {
    if (parentKey) {
      return formData[parentKey][paramKey];
    } else {
      return formData[paramKey];
    }
  }, [formData]);

  const inputType = useCallback(
    (param: Record<string, any>) => {
      //   if (!param.type || param.type === "string" || param.type === "array") {
      //     return (
      //       <FormControl fullWidth>
      //         <TextField variant="standard" label={getLabel(param)}></TextField>
      //       </FormControl>
      //     );
      //   }
      //   if (param.type === "object") {
      //   }
      //   if (param.type === "boolean") {
      //   }
      //   if (param.type === "enum") {
      //   }
      //   if (param.type === "integer") {
      //   }
      //   if (param.type === "") {
      //   }
      getValue();

      return (
        <div className="u-padding-vertical--normal">
          <FormControl fullWidth>
            <TextField
              variant="standard"
              label={getLabel(param)}
              onChange={(event) => handleInputChange(event, parentKey)}
              defaultValue={getValue()}
              name={paramKey}
            ></TextField>
          </FormControl>
        </div>
      );
    },
    [param, getValue]
  );

  return (
    <div className={classNames("params-field", { "params-field-properties": hasProperties })}>
      {hasProperties && paramKey}
      {renderInput()}
    </div>
  );
};

export default ParamsField;
