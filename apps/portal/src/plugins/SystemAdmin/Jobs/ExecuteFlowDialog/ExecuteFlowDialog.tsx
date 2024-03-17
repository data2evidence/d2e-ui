import React, { FC, useCallback, useState, useEffect } from "react";
import { Button, Dialog, FormControl, TextField } from "@portal/components";
import { Feedback, CloseDialogType, Flow } from "../../../../types";
import Divider from "@mui/material/Divider";
import { api } from "../../../../axios/api";
import "./ExecuteFlowDialog.scss";

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
          message: "An error has occurred.",
          description: "Please try again. To report the error, please send an email to help@data4life.care.",
        });
      }
      console.error("err", err);
    } finally {
      setLoading(false);
    }
  }, [deploymentName, flowName, flowRunName, formData, formDataIsEmpty, handleClose, validateFormData]);

  return (
    <Dialog
      className="execute-flow-dialog"
      title="Execute flow"
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
      feedback={feedback}
      maxWidth="md"
    >
      <Divider />

      <div className="execute-flow-dialog__content">
        <span className="subheader">Flow run</span>
        <div className="u-padding-vertical--normal">
          <FormControl fullWidth>
            <TextField
              error={flowRunNameError}
              variant="standard"
              label="Name"
              onChange={(event) => setFlowRunName(event.target.value)}
              helperText={flowRunNameError && "This is required"}
            />
          </FormControl>
        </div>

        {inputs?.length !== 0 && <span className="subheader">Flow parameters</span>}
        {inputs?.length !== 0 &&
          inputs?.map((input, index) => (
            <div className="u-padding-vertical--normal" key={index}>
              <FormControl fullWidth>
                <TextField
                  error={input.error}
                  variant="standard"
                  label={input.name}
                  onChange={(event) => handleInputChange(event, input.name)}
                  helperText={input.error && "This is required"}
                />
              </FormControl>
            </div>
          ))}
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button text="Cancel" onClick={() => handleClose("cancelled")} variant="secondary" block disabled={loading} />
        <Button text="Execute" onClick={handleAdd} block loading={loading} disabled={formDataIsEmpty()} />
      </div>
    </Dialog>
  );
};

export default ExecuteFlowDialog;
