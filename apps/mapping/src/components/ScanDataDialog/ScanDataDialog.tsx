import React, { FC, useCallback, useMemo, useRef, useState } from "react";
import { Button, Dialog, InputLabel, DialogTitle, TextField, FormGroup, FormControlLabel } from "@mui/material";
import { Check } from "@mui/icons-material";
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
  dbType: "PostgreSQL",
  server: "",
  port: 5432,
  database: "",
  user: "",
  password: "",
  schema: "",
};

export const ScanDataDialog: FC<ScanDataDialogProps> = ({ open, onClose, setScanId }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [dataType, setDataType] = useState("");
  const [loading, setLoading] = useState(false);
  const [delimiter, setDelimiter] = useState(",");
  const [postgresqlForm, setPostgresqlForm] = useState<ScanDataPostgresForm>(EMPTY_POSTGRESQL_FORM_DATA);
  const [canConnect, setCanConnect] = useState(false);
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
      if (dataType === "csv") {
        scanData();
      } else {
        scanDBData();
      }
      handleClose("success");
    } catch (err: any) {
      console.error("err", err);
    } finally {
      setLoading(false);
    }
  }, [selectedTables, dataType]);

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

  const handleTestConnection = useCallback(async () => {
    if (dataType === "csv") {
      setAvailableTables(uploadedFiles.map((file) => file.name));
    } else if (dataType === "postgresql") {
      const res = await api.whiteRabbit.testDBConnection(postgresqlForm);
      if (res.canConnect) {
        setCanConnect(true);
        setAvailableTables(res.tableNames);
      } else {
        // TODO: Open up connection failed dialog
        return;
      }
      console.log(res);
      return;
    }
  }, [postgresqlForm, uploadedFiles, dataType]);

  const handleClear = useCallback(() => {
    if (dataType === "csv") {
      setDataType("");
      setSelectedTables([]);
      setAvailableTables([]);
      setUploadedFiles([]);
      setDelimiter(",");
    } else if (dataType === "postgresql") {
      setPostgresqlForm(EMPTY_POSTGRESQL_FORM_DATA);
    }
  }, [dataType]);

  const handleSelectedFile = useCallback((event: React.ChangeEvent<HTMLInputElement>, file: string) => {
    if (event.target.checked) {
      setSelectedTables((prev) => [...prev, file]);
    } else {
      setSelectedTables((prev) => prev.filter((f) => f !== file));
    }
  }, []);

  const handleSelectedFileAll = useCallback(
    (select: boolean) => {
      if (select) {
        const tables = dataType === "csv" ? uploadedFiles.map((file) => file.name) : availableTables;
        setSelectedTables(tables);
      } else {
        setSelectedTables([]);
      }
    },
    [dataType, uploadedFiles, availableTables]
  );

  const checkSelectedFile = useCallback(
    (file: string): boolean | undefined => selectedTables.some((selectedFile) => selectedFile === file),
    [selectedTables]
  );

  const scanData = useCallback(async () => {
    try {
      setLoading(true);
      if (uploadedFiles) {
        const response = await api.whiteRabbit.createScanReport(uploadedFiles);
        setScanId(response.id);
      } else {
        console.error("No file was uploaded");
      }
    } catch {
      console.error("Failed to create scan report from CSV");
      setLoading(false);
    }
  }, [uploadedFiles]);

  const scanDBData = useCallback(async () => {
    try {
      setLoading(true);
      if (canConnect) {
        const response = await api.whiteRabbit.createDBScanReport(postgresqlForm, selectedTables);
        setScanId(response.id);
      } else {
        console.error("No connection to the database was established");
      }
    } catch (error) {
      console.error("Failed to create scan report from DB", error);
      setLoading(false);
    }
  }, [postgresqlForm, selectedTables]);

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
                  <Button onClick={handleClear}>Clear all</Button>
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
                  <Button onClick={handleClear}>Clear all</Button>
                </>
              )}
            </div>
            <div className="button-group-container">
              <div className="button-container">
                <Button
                  onClick={handleTestConnection}
                  variant="outlined"
                  disabled={uploadedFiles.length === 0 && !isFormValid(postgresqlForm)}
                >
                  Test Connection
                </Button>
              </div>
              {canConnect && (
                <div className="success-message-container">
                  <Check />
                  <div>Connected</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="scan-data-dialog__container">
          <div className="container-header">Table to Scan</div>
          <div className="container-content-scan">
            {availableTables.length ? (
              <>
                <div className="button-container">
                  <Button onClick={() => handleSelectedFileAll(true)}>Select all</Button>
                  <Button onClick={() => handleSelectedFileAll(false)}>Deselect all</Button>
                </div>
                <FormGroup>
                  {availableTables.map((file) => (
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
          disabled={selectedTables.length === 0}
          style={{ marginLeft: "20px" }}
        >
          {loading ? "Loading..." : "Apply"}
        </Button>
      </div>
    </Dialog>
  );
};
