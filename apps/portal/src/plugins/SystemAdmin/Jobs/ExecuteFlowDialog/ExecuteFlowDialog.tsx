import React, { FC, useCallback, useState, useEffect } from "react";
import { Button, Dialog, FormControl, TextField } from "@portal/components";
import { Feedback, CloseDialogType, Flow } from "../../../../types";
import Divider from "@mui/material/Divider";
import { api } from "../../../../axios/api";
import "./ExecuteFlowDialog.scss";
import { useTranslation } from "../../../../contexts";
import { getParameters, getProperties } from "../../../../utils";
import ParamsField from "../ParamsField/ParamsField";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import CodeEditor from "../CodeEditor/CodeEditor";

interface ExecuteFlowDialogProps {
  flow?: Flow;
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
}

interface InputField {
  name: string;
  required: boolean;
  error?: boolean;
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
  const [inputs, setInputs] = useState<InputField[]>([]);
  const [prefectProperties, setPrefectProperties] = useState<Record<string, any>>({});
  const [deploymentName, setDeploymentName] = useState("");
  const [flowRunName, setFlowRunName] = useState("");
  const [flowRunNameError, setFlowRunNameError] = useState(false);
  const [paramType, setParamType] = useState(ParamType.Field);
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
      setInputs([]);
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

  const handleJSONChange = useCallback(
    (value: string) => {
      setFormData(JSON.parse(value));
    },
    [formData]
  );

  const handleParamTypeChange = useCallback(
    (event: React.MouseEvent<HTMLElement>, type: ParamType) => {
      setParamType(type);
    },
    [formData]
  );

  const formDataIsEmpty = useCallback(() => {
    return Object.keys(formData).length === 0 && flowRunName === "";
  }, [flowRunName, formData]);

  const validateFormData = useCallback(() => {
    let errors: string[] = [];
    inputs.forEach((input) => {
      if ((formData[input.name] === "" && input.required) || (!formData[input.name] && input.required)) {
        errors.push(input.name);
      } else {
        errors = errors.filter((i) => i !== input.name);
      }
    });

    const updatedInputs = inputs.map((i) => {
      if (errors.includes(i.name)) {
        return { ...i, error: true };
      } else {
        return { ...i, error: false };
      }
    });

    setInputs(updatedInputs);

    if (flowRunName === "") {
      setFlowRunNameError(true);
    } else {
      setFlowRunNameError(false);
    }

    return errors.length !== 0 || flowRunName === "";
  }, [flowRunName, formData, inputs]);

  const formatParams = useCallback(() => {
    const newFormData = { ...formData };

    const keysToParse = ["options", "analysis_spec", "json_graph"];

    keysToParse.forEach((key) => {
      if (formData[key]) {
        newFormData[key] = JSON.parse(formData[key]);
      }
    });

    return newFormData;
  }, [formData]);

  const handleAdd = useCallback(async () => {
    if (formDataIsEmpty() || validateFormData()) {
      return;
    }

    try {
      setLoading(true);

      console.log(formData);

      // const flowRun = {
      //   flowRunName: flowRunName,
      //   flowName: flowName,
      //   deploymentName: deploymentName,
      //   params: formatParams(),
      // };

      // await api.dataflow.executeFlowRunByDeployment(flowRun);
      // handleClose("success");
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
            <div key={index}>
              <ParamsField
                param={prefectProperties[paramKey]}
                paramKey={paramKey}
                key={index}
                handleInputChange={handleInputChange}
                formData={formData}
              />
            </div>
          ))
        ) : (
          <div className="u-padding-vertical--normal">
            <CodeEditor value={formData} onChange={handleJSONChange}></CodeEditor>
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
