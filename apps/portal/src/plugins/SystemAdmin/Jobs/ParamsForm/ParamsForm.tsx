import { Form } from "@rjsf/mui";
import { RJSFSchema, RegistryWidgetsType, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import React, { FC } from "react";
import TextFieldWrapper from "../TextFieldWrapper";

interface ParamsFormProps {
  schema: RJSFSchema;
  formData: Record<string, any>;
  onChange: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const ParamsForm: FC<ParamsFormProps> = ({ schema, formData, onChange }) => {
  //   const uiSchema: UiSchema = {
  //     options: {
  //       data_model: {
  //         "ui:widget": "textarea",
  //       },
  //     },
  //   };

  const widgets: RegistryWidgetsType = {
    TextWidget: TextFieldWrapper,
    SelectWidget: TextFieldWrapper,
  };

  return (
    <Form
      schema={schema}
      validator={validator}
      onChange={(e) => onChange(e.formData)}
      formData={formData}
      //   uiSchema={uiSchema}
      widgets={widgets}
    >
      {/* <button style={{ display: "none" }} /> */}
    </Form>
  );
};

export default ParamsForm;
