import React, { FC, useCallback, useMemo, useRef, useState } from "react";
import { Button, Dialog, InputLabel, DialogTitle, TextField, FormGroup, FormControlLabel } from "@mui/material";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { api } from "../../axios/api";
import { ScanDataPostgresForm } from "../../types/scanDataDialog";
import "./ScanDataDialog.scss";

export type CloseDialogType = "success" | "cancelled";
interface ScanDataDialogProps {
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
  setScanId: (id: number) => void;
}

const EMPTY_POSTGRESQL_FORM_DATA = {
  server: "localhost",
  port: 5432,
  database: "",
  user: "",
  password: "",
  schema: "",
};

export const ScanDataDialog: FC<ScanDataDialogProps> = ({ open, onClose, setScanId }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [dataType, setDataType] = useState("");
  const [loading, setLoading] = useState(false);
  const [delimiter, setDelimiter] = useState(",");
  const [postgresqlForm, setPostgresqlForm] = useState<ScanDataPostgresForm>(EMPTY_POSTGRESQL_FORM_DATA);
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      typeof onClose === "function" && onClose(type);
    },
    [onClose]
  );

  const handleApply = useCallback(async () => {
    try {
      setLoading(true);
      scanData();
      handleClose("success");
    } catch (err: any) {
      console.error("err", err);
    } finally {
      setLoading(false);
    }
  }, [selectedFiles, delimiter, handleClose]);

  const handleDataTypeChange = useCallback((event: SelectChangeEvent<string>) => {
    setDataType(event.target.value);
  }, []);

  const handleSelectFile = useCallback((_event: any) => {
    hiddenFileInput.current && hiddenFileInput.current.click();
  }, []);

  const handleFileUpload = useCallback((event: any) => {
    const files = Array.from(event.target.files).map((file: any) => file);
    setUploadedFiles(files);
  }, []);

  const handleDelimiterChange = useCallback((event: SelectChangeEvent<string>) => {
    setDelimiter(event.target.value as string);
  }, []);

  const handlePostgresFormChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPostgresqlForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }, []);

  const handleTestConnection = useCallback(
    (dataType: string) => {
      if (dataType === "csv") {
        setAvailableFiles(uploadedFiles.map((file) => file.name));
      } else if (dataType === "postgresql") {
        // TODO: Call white-rabbit to connect DB
        return;
      }
    },
    [uploadedFiles]
  );

  const handleClear = useCallback((dataType: string) => {
    if (dataType === "csv") {
      setDataType("");
      setSelectedFiles([]);
      setAvailableFiles([]);
      setUploadedFiles([]);
      setDelimiter(",");
    } else if (dataType === "postgresql") {
      setPostgresqlForm(EMPTY_POSTGRESQL_FORM_DATA);
    }
  }, []);

  const handleSelectedFile = useCallback((event: React.ChangeEvent<HTMLInputElement>, file: string) => {
    if (event.target.checked) {
      setSelectedFiles((prev) => [...prev, file]);
    } else {
      setSelectedFiles((prev) => prev.filter((f) => f !== file));
    }
  }, []);

  const handleSelectedFileAll = useCallback(
    (select: boolean) => {
      if (select) {
        setSelectedFiles(uploadedFiles.map((file) => file.name));
      } else {
        setSelectedFiles([]);
      }
    },
    [uploadedFiles]
  );

  const checkSelectedFile = useCallback(
    (file: string): boolean | undefined => selectedFiles.some((selectedFile) => selectedFile === file),
    [selectedFiles]
  );

  const scanData = async () => {
    try {
      setLoading(true);
      if (uploadedFiles) {
        const response = await api.whiteRabbit.createScanReport(uploadedFiles);
        setScanId(response.id);
      } else {
        console.error("No file was uploaded");
      }
    } catch {
      setLoading(false);
    }
  };

  const fileNames = useMemo(() => uploadedFiles.map((file) => file.name).join(", "), [uploadedFiles]);

  const isFormValid = (formData: ScanDataPostgresForm) => {
    return Object.entries(formData)
      .filter(([key]) => key !== "httppath") // Exclude 'httppath'
      .every(([, value]) => value !== "" && value !== null && value !== undefined);
  };

  return (
    <Dialog
      className="scan-data-dialog"
      title="Scan Data"
      open={open}
      onClose={() => handleClose("cancelled")}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Scan Data</DialogTitle>
      <Divider />
      <div className="scan-data-dialog__content">
        <div className="scan-data-dialog__container">
          <div className="container-header">Select Data Location</div>
          <div className="container-content-data">
            <div className="form-container">
              <FormControl fullWidth variant="standard" className="scan-data-dialog__form-control">
                <InputLabel>Data type</InputLabel>
                <Select value={dataType} label="Data type" onChange={handleDataTypeChange}>
                  <MenuItem value="csv">CSV files</MenuItem>
                  <MenuItem value="postgresql">Postgresql</MenuItem>
                </Select>
              </FormControl>
              {dataType === "csv" && (
                <>
                  <FormControl fullWidth className="scan-data-dialog__form-control">
                    <TextField
                      fullWidth
                      variant="standard"
                      InputProps={{
                        readOnly: true,
                      }}
                      onClick={handleSelectFile}
                      value={fileNames}
                      label="Upload file"
                    />
                    <input
                      ref={hiddenFileInput}
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                      id="upload-csv"
                      multiple
                    />
                  </FormControl>

                  <FormControl fullWidth variant="standard" className="scan-data-dialog__form-control">
                    <InputLabel>Delimeter</InputLabel>
                    <Select label="Delimeter" value={delimiter} onChange={handleDelimiterChange}>
                      <MenuItem value=",">,</MenuItem>
                    </Select>
                  </FormControl>
                  <Button onClick={() => handleClear(dataType)}>Clear all</Button>
                </>
              )}
              {dataType === "postgresql" && (
                <>
                  <FormControl fullWidth variant="standard" className="scan-data-dialog__form-control">
                    <TextField
                      name="server"
                      label="Server Location"
                      value={postgresqlForm.server}
                      onChange={handlePostgresFormChange}
                      variant="standard"
                    />
                  </FormControl>
                  <FormControl fullWidth variant="standard" className="scan-data-dialog__form-control">
                    <TextField
                      name="port"
                      label="Port"
                      value={postgresqlForm.port}
                      onChange={handlePostgresFormChange}
                      variant="standard"
                    />
                  </FormControl>
                  <FormControl fullWidth variant="standard" className="scan-data-dialog__form-control">
                    <TextField
                      name="user"
                      label="User Name"
                      value={postgresqlForm.user}
                      onChange={handlePostgresFormChange}
                      variant="standard"
                    />
                  </FormControl>
                  <FormControl fullWidth variant="standard" className="scan-data-dialog__form-control">
                    <TextField
                      name="password"
                      label="Password"
                      value={postgresqlForm.password}
                      onChange={handlePostgresFormChange}
                      variant="standard"
                      type="password"
                    />
                  </FormControl>
                  <FormControl fullWidth variant="standard" className="scan-data-dialog__form-control">
                    <TextField
                      name="database"
                      label="Database Name"
                      value={postgresqlForm.database}
                      onChange={handlePostgresFormChange}
                      variant="standard"
                    />
                  </FormControl>
                  <FormControl fullWidth variant="standard" className="scan-data-dialog__form-control">
                    <TextField
                      name="schema"
                      label="Schema Name"
                      value={postgresqlForm.schema}
                      onChange={handlePostgresFormChange}
                      variant="standard"
                    />
                  </FormControl>
                  <Button onClick={() => handleClear(dataType)}>Clear all</Button>
                </>
              )}
            </div>

            <div className="button-container">
              <Button
                onClick={() => handleTestConnection(dataType)}
                variant="outlined"
                disabled={uploadedFiles.length === 0 && !isFormValid(postgresqlForm)}
              >
                Test Connection
              </Button>
            </div>
          </div>
        </div>
        <div className="scan-data-dialog__container">
          <div className="container-header">Table to Scan</div>
          <div className="container-content-scan">
            {availableFiles.length ? (
              <>
                <div className="button-container">
                  <Button onClick={() => handleSelectedFileAll(true)}>Select all</Button>
                  <Button onClick={() => handleSelectedFileAll(false)}>Deselect all</Button>
                </div>
                <FormGroup>
                  {availableFiles.map((file) => (
                    <FormControlLabel
                      key={file}
                      control={
                        <Checkbox
                          checked={checkSelectedFile(file)}
                          onChange={(event) => handleSelectedFile(event, file)}
                        />
                      }
                      label={file}
                    />
                  ))}
                </FormGroup>
              </>
            ) : (
              <>No files to scan</>
            )}
          </div>
        </div>
      </div>
      <Divider />
      <div className="button-group-actions">
        <Button onClick={() => handleClose("cancelled")} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          disabled={selectedFiles.length === 0}
          style={{ marginLeft: "20px" }}
        >
          {loading ? "Loading..." : "Apply"}
        </Button>
      </div>
    </Dialog>
  );
};
