import React, { FC, useCallback, useState, useEffect } from "react";
import { Button, Dialog, FormControl, TextField } from "@portal/components";
import { Feedback, CloseDialogType, Flow } from "../../../../types";
import Divider from "@mui/material/Divider";
import { api } from "../../../../axios/api";
import { useTranslation } from "../../../../contexts";
import { getParameters, getProperties } from "../../../../utils";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import JSONEditor from "../JSONEditor/JSONEditor";
import ParamsForm from "../ParamsForm/ParamsForm";
import "./ExecuteFlowDialog.scss";

interface ExecuteFlowDialogProps {
  flow?: Flow;
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
}

interface FormDataField {
  [key: string]: any;
}

enum ParamType {
  Field = "field",
  JSON = "json",
}

const ExecuteFlowDialog: FC<ExecuteFlowDialogProps> = ({ flow, open, onClose }) => {
  const { getText, i18nKeys } = useTranslation();
  const [formData, setFormData] = useState<FormDataField>({});
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({});
  const [prefectProperties, setPrefectProperties] = useState<Record<string, any>>({});
  const [deploymentName, setDeploymentName] = useState("");
  const [flowRunName, setFlowRunName] = useState("");
  const [flowRunNameError, setFlowRunNameError] = useState(false);
  const [paramType, setParamType] = useState(ParamType.Field);
  const [errors, setErrors] = useState<string[]>([]);
  const flowName = flow?.name || "";

  const fetchDeployment = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const deployment = await api.dataflow.getDeploymentByFlowId(id);
      if (!deployment) return;
      const properties = getProperties(deployment.parameter_openapi_schema);
      const params = getParameters(properties, deployment.parameters);
      setPrefectProperties(properties);
      setFormData(params);
      setDeploymentName(deployment.name);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (flow) fetchDeployment(flow.id);
  }, [fetchDeployment, flow]);

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFeedback({});
      setFormData({});
      setPrefectProperties({});
      setErrors([]);
      typeof onClose === "function" && onClose(type);
    },
    [onClose, setFeedback]
  );

  const handleInputChange = useCallback(
    (value: string, name: string, parent?: string, child?: string) => {
      if (!parent) {
        setFormData((formData) => ({ ...formData, [name]: value }));
      } else {
        if (child) {
          setFormData((formData) => {
            const newFormData = { ...formData };
            newFormData[parent][child][name] = value;
            return newFormData;
          });
        } else {
          setFormData((formData) => {
            const newFormData = { ...formData };
            newFormData[parent][name] = value;
            return newFormData;
          });
        }
      }
    },
    [formData]
  );

  const handleJSONChange = useCallback((value: string) => {
    try {
      setFormData(JSON.parse(value));
    } catch (error) {
      return;
    }
  }, []);

  const handleParamTypeChange = useCallback((event: React.MouseEvent<HTMLElement>, type: ParamType) => {
    setParamType(type);
  }, []);

  const formDataIsEmpty = useCallback(() => {
    return Object.keys(formData).length === 0 && flowRunName === "";
  }, [flowRunName, formData]);

  const checkNestedProperties = useCallback((properties: Record<string, any>, formData: Record<string, any>) => {
    let errors: string[] = [];
    for (const prop in properties) {
      const form = formData[prop];
      if (hasError(properties[prop], form)) {
        errors.push(prop);
      }
      if (properties[prop].type === "object" && properties[prop].properties) {
        errors = [...errors, ...checkNestedProperties(properties[prop].properties, formData[prop])];
      }
    }
    return errors;
  }, []);

  const validateFormData = useCallback(() => {
    let errorsArr: string[] = [];

    if (flowRunName === "") {
      setFlowRunNameError(true);
    } else {
      setFlowRunNameError(false);
    }

    for (const key in formData) {
      if (prefectProperties[key].type === "object" && prefectProperties[key].properties) {
        const properties = prefectProperties[key].properties;
        errorsArr = [...errorsArr, ...checkNestedProperties(properties, formData[key])];
      } else {
        if (hasError(prefectProperties[key], formData[key])) {
          errorsArr.push(key);
        }
      }
    }
    setErrors(errorsArr);
    return errors.length !== 0 || flowRunName === "";
  }, [flowRunName, formData, errors]);

  function hasError(property: Record<string, any>, form: Record<string, any>) {
    if (property.type === "boolean") {
      return property.required && (form === undefined || form === null);
    }
    return property.required && !form;
  }

  const handleAdd = useCallback(async () => {
    if (formDataIsEmpty() || validateFormData()) {
      return;
    }

    try {
      setLoading(true);

      const flowRun = {
        flowRunName: flowRunName,
        flowName: flowName,
        deploymentName: deploymentName,
        params: formData,
      };

      // await api.dataflow.executeFlowRunByDeployment(flowRun);
      handleClose("success");
    } catch (err: any) {
      if (err.data?.message) {
        setFeedback({ type: "error", message: err.data?.message });
      } else {
        setFeedback({
          type: "error",
          message: getText(i18nKeys.EXECUTE_FLOW_DIALOG__ERROR),
          description: getText(i18nKeys.EXECUTE_FLOW_DIALOG__ERROR_DESCRIPTION),
        });
      }
      console.error("err", err);
    } finally {
      setLoading(false);
    }
  }, [deploymentName, flowName, flowRunName, formData, formDataIsEmpty, handleClose, validateFormData, getText]);

  return (
    <Dialog
      className="execute-flow-dialog"
      title={`${getText(i18nKeys.EXECUTE_FLOW_DIALOG__EXECUTE_FLOW)} | ${flowName}`}
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
      feedback={feedback}
      maxWidth="md"
    >
      <Divider />

      <div className="execute-flow-dialog__content">
        <span className="subheader">{getText(i18nKeys.EXECUTE_FLOW_DIALOG__FLOW_RUN)}</span>
        <div className="u-padding-vertical--normal">
          <FormControl fullWidth>
            <TextField
              error={flowRunNameError}
              variant="standard"
              label={getText(i18nKeys.EXECUTE_FLOW_DIALOG__NAME)}
              onChange={(event) => setFlowRunName(event.target.value)}
              helperText={flowRunNameError && getText(i18nKeys.EXECUTE_FLOW_DIALOG__REQUIRED)}
            />
          </FormControl>
        </div>
        {Object.keys(prefectProperties).length !== 0 && (
          <>
            <span className="subheader">{getText(i18nKeys.EXECUTE_FLOW_DIALOG__FLOW_PARAMETERS)}</span>
            <div className="u-padding-vertical--normal toggle-button-container">
              <ToggleButtonGroup color="primary" value={paramType} exclusive onChange={handleParamTypeChange}>
                <ToggleButton value={ParamType.Field}>Field</ToggleButton>
                <ToggleButton value={ParamType.JSON}>JSON</ToggleButton>
              </ToggleButtonGroup>
            </div>
          </>
        )}

        {paramType === ParamType.Field ? (
          Object.keys(prefectProperties).map((paramKey, index) => (
            <ParamsForm
              param={prefectProperties[paramKey]}
              paramKey={paramKey}
              key={index}
              handleInputChange={handleInputChange}
              formData={formData}
              errors={errors}
            />
          ))
        ) : (
          <div className="u-padding-vertical--normal">
            <JSONEditor value={formData} onChange={handleJSONChange}></JSONEditor>
          </div>
        )}
      </div>

      <Divider />
      <div className="button-group-actions">
        <Button
          text={getText(i18nKeys.EXECUTE_FLOW_DIALOG__CANCEL)}
          onClick={() => handleClose("cancelled")}
          variant="outlined"
          block
          disabled={loading}
        />
        <Button
          text={getText(i18nKeys.EXECUTE_FLOW_DIALOG__EXECUTE)}
          onClick={handleAdd}
          block
          loading={loading}
          disabled={formDataIsEmpty()}
        />
      </div>
    </Dialog>
  );
};

export default ExecuteFlowDialog;
