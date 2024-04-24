import React, { FC, useCallback, useState, useEffect } from "react";
import { Button, Dialog, FormControl, TextField } from "@portal/components";
import { Feedback, CloseDialogType, Flow } from "../../../../types";
import Divider from "@mui/material/Divider";
import { api } from "../../../../axios/api";
import "./ExecuteFlowDialog.scss";
import { useTranslation } from "../../../../contexts";

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
  [key: string]: string;
}

const ExecuteFlowDialog: FC<ExecuteFlowDialogProps> = ({ flow, open, onClose }) => {
  const { getText, i18nKeys } = useTranslation();
  const [formData, setFormData] = useState<FormDataField>({});
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({});
  const [inputs, setInputs] = useState<InputField[]>([]);
  const [deploymentName, setDeploymentName] = useState("");
  const [flowRunName, setFlowRunName] = useState("");
  const [flowRunNameError, setFlowRunNameError] = useState(false);
  const flowName = flow?.name || "";

  const fetchDeployment = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const deployment = await api.dataflow.getDeploymentByFlowId(id);
      const input = deployment.parameter_openapi_schema.properties;
      const required: string[] = deployment.parameter_openapi_schema.required;
      const inputFields = [];
      for (const key in input) {
        inputFields.push({ name: key, required: required.includes(key) });
      }
      setInputs(inputFields);
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
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
      setFormData((formData) => ({ ...formData, [key]: event.target.value }));
    },
    []
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

      const flowRun = {
        flowRunName: flowRunName,
        flowName: flowName,
        deploymentName: deploymentName,
        params: formatParams(),
      };

      await api.dataflow.executeFlowRunByDeployment(flowRun);
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
      title={getText(i18nKeys.EXECUTE_FLOW_DIALOG__EXECUTE_FLOW)}
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

        {inputs?.length !== 0 && (
          <span className="subheader">{getText(i18nKeys.EXECUTE_FLOW_DIALOG__FLOW_PARAMETERS)}</span>
        )}
        {inputs?.length !== 0 &&
          inputs?.map((input, index) => (
            <div className="u-padding-vertical--normal" key={index}>
              <FormControl fullWidth>
                <TextField
                  error={input.error}
                  variant="standard"
                  label={input.name}
                  onChange={(event) => handleInputChange(event, input.name)}
                  helperText={input.error && getText(i18nKeys.EXECUTE_FLOW_DIALOG__REQUIRED)}
                />
              </FormControl>
            </div>
          ))}
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
