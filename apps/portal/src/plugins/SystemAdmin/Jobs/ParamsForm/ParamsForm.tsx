import React, { FC } from "react";
import ParamsField from "../ParamsField/ParamsField";

interface ParamsFormProps {
  param: Record<string, any>;
  paramKey: string;
  handleInputChange: (value: any, name: string, parent?: string, child?: string) => void;
  errors: string[];
  formData: Record<string, any>;
}

const ParamsForm: FC<ParamsFormProps> = ({ param, paramKey, handleInputChange, formData, errors }) => {
  return (
    <div className="params-form">
      {!param.properties ? (
        <>
          <ParamsField
            param={param}
            paramKey={paramKey}
            handleInputChange={handleInputChange}
            errors={errors}
            formData={formData}
          />
        </>
      ) : (
        <>
          {paramKey}
          {Object.keys(param.properties).map((p) => (
            <ParamsField
              key={p}
              param={param.properties[p]}
              paramKey={p}
              handleInputChange={handleInputChange}
              formData={formData}
              errors={errors}
              parentKey={paramKey}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default ParamsForm;
