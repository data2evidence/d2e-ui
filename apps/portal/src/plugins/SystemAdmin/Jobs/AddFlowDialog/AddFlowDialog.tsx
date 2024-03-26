import React, { FC, useCallback, useState, ChangeEvent } from "react";
import { Button, Dialog, IconButton, TableCell, TableRow, TextField, TrashIcon } from "@portal/components";
import { Feedback, CloseDialogType } from "../../../../types";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { api } from "../../../../axios/api";
import "./AddFlowDialog.scss";

interface AddFlowDialogProps {
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
}

interface FormData {
  name: string;
  url?: string;
  method: string;
}

enum FlowUploadMethod {
  URL = "URL",
  FILE = "FILE",
}

const EMPTY_FORM_DATA: FormData = { name: "", method: "FILE" };

const AddFlowDialog: FC<AddFlowDialogProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({});
  const [selectedFile, setSelectedFile] = useState<File>();
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);

  const handleFormDataChange = useCallback(
    (updates: { [field: string]: any }) => {
      setFormData((formData) => ({ ...formData, ...updates }));
    },
    [setFormData]
  );

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setFeedback({});
      setFormData(EMPTY_FORM_DATA);
      setSelectedFile(undefined);
      typeof onClose === "function" && onClose(type);
    },
    [onClose, setFeedback]
  );

  const handleAdd = useCallback(async () => {
    const { name, url } = formData;
    if (name == null || (selectedFile == null && url == null)) return;
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType.endsWith("zip") && url) {
        setFeedback({
          type: "error",
          message: "Zip/tgz file upload should not have git url provided",
        });
        return;
      } else if (!(fileType.endsWith("zip") || fileType.endsWith("x-zip-compressed"))) {
        setFeedback({
          type: "error",
          message: "Uploaded file type not supported",
        });
        return;
      }
    }
    try {
      setLoading(true);
      if (!url) {
        await api.dataflow.addFlowFromFileDeployment(selectedFile);
      } else {
        await api.dataflow.addFlowFromGitUrlDeployment(url);
      }
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
  }, [formData.name, handleClose, selectedFile, formData.url]);

  const handleAddFile = useCallback(() => {
    setFeedback({});

    if (hiddenFileInput.current !== null) {
      hiddenFileInput.current.click();
    }
  }, [hiddenFileInput]);

  const handleSelectFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length == 0) return;
    setSelectedFile(e.target.files[0]);
  }, []);

  const handleUploadMethodChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setFormData({ ...formData, method: event.target?.value || "" });
    },
    [formData]
  );

  return (
    <Dialog
      className="add-flow-dialog"
      title="Add flow"
      closable
      open={open}
      onClose={() => handleClose("cancelled")}
      feedback={feedback}
      maxWidth="md"
    >
      <Divider />
      <div className="snapshotlocation__radiogroup">
        <FormControl component="fieldset">
          <FormLabel component="legend">Upload Method</FormLabel>
          <RadioGroup name="uploadmethod" value={formData.method} onChange={handleUploadMethodChange}>
            <FormControlLabel value="URL" control={<Radio />} label="via url" />
            <FormControlLabel value="FILE" control={<Radio />} label="via file upload" />
          </RadioGroup>
        </FormControl>
      </div>
      <div className="add-flow-dialog__content">
        {formData.method === FlowUploadMethod.URL && (
          <div className="u-padding-vertical--normal">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                label="Git url"
                value={formData.url}
                onChange={(event) => handleFormDataChange({ url: event.target.value })}
              />
            </FormControl>
          </div>
        )}
        {formData.method === FlowUploadMethod.FILE && (
          <div className="u-padding-vertical--normal add-flow-dialog__files">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "40%" }}>Filename</TableCell>
                  <TableCell style={{ width: "20%" }}>Size</TableCell>
                  <TableCell style={{ width: "20%" }}>File</TableCell>
                  <TableCell style={{ width: "20%" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!selectedFile ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <div className="add-flow-dialog__no-files">
                        <span>No file available</span>
                        <Button text="Select file" onClick={handleAddFile} variant="secondary" />
                        <input
                          type="file"
                          pattern="(.+).(py|zip)$"
                          name="prefectFile"
                          ref={hiddenFileInput}
                          onChange={handleSelectFile}
                          onClick={() => {
                            if (hiddenFileInput.current) {
                              hiddenFileInput.current.value = "";
                            }
                          }}
                          style={{ display: "none" }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={selectedFile.name}>
                    <TableCell style={{ color: "#000e7e" }}>{selectedFile.name}</TableCell>
                    <TableCell style={{ color: "#000e7e" }}>{selectedFile.size}</TableCell>
                    <TableCell style={{ color: "#000e7e" }}>{selectedFile.type}</TableCell>
                    <TableCell>
                      <IconButton startIcon={<TrashIcon />} title="Delete" onClick={() => setSelectedFile(undefined)} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button text="Cancel" onClick={() => handleClose("cancelled")} variant="secondary" block disabled={loading} />
        <Button text="Add" onClick={handleAdd} block loading={loading} disabled={!selectedFile && !formData.url} />
      </div>
    </Dialog>
  );
};

export default AddFlowDialog;
