import { FormControl, TextField } from "@portal/components";
import classNames from "classnames";
import React, { FC, useCallback, useState, useEffect, useMemo } from "react";
import "./ParamsField.scss";

interface ParamsFieldProps {
  param: Record<string, any>;
  paramKey: string;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    parent?: string,
    child?: string
  ) => void;
  formData: Record<string, any>;
  parentKey?: string;
  childKey?: string;
}

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
        ></ParamsField>
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

      return (
        <div className="u-padding-vertical--normal">
          <FormControl fullWidth>
            <TextField
              variant="standard"
              label={getLabel(param)}
              onChange={(event) => handleInputChange(event, parentKey, childKey)}
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
