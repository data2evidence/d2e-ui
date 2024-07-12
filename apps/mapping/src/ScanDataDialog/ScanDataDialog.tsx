import React, { FC, useCallback, useMemo, useRef, useState } from "react";
import {
  Button,
  Dialog,
  InputLabel,
  DialogTitle,
  TextField,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import sourceTableData from "../../dummyData/create_source_schema_scan.json";
import twoSourceTableData from "../../dummyData/healthcare_and_concept.json";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { DispatchType, NodeType } from "../contexts/FlowContext";
import { Position, useUpdateNodeInternals } from "reactflow";
import "./ScanDataDialog.scss";

// TODO: Clean up and create separate files for all interfaces and types
type CloseDialogType = "success" | "cancelled";
interface ScanDataDialogProps {
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
  nodeId: string;
  dispatch: React.Dispatch<any>;
}

const ScanDataDialog: FC<ScanDataDialogProps> = ({
  open,
  onClose,
  nodeId,
  dispatch,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [_availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [dataType, setDataType] = useState("");
  const [loading, setLoading] = useState(false);
  const [delimiter, setDelimiter] = useState(",");
  const updateNodeInternals = useUpdateNodeInternals();
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      handleClear();
      typeof onClose === "function" && onClose(type);
    },
    [onClose]
  );

  const handleApply = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual data scanning logic
      // await api.data.scanData(selectedFiles, delimiter);
      scanData();
      handleClose("success");
    } catch (err: any) {
      console.error("err", err);
    } finally {
      setLoading(false);
    }
  }, [selectedFiles, delimiter, handleClose]);

  const handleDataTypeChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      setDataType(event.target.value);
    },
    []
  );

  const handleSelectFile = useCallback((_event: any) => {
    hiddenFileInput.current && hiddenFileInput.current.click();
  }, []);

  const handleFileUpload = useCallback((event: any) => {
    const files = Array.from(event.target.files).map((file: any) => file.name);
    setUploadedFiles(files);
  }, []);

  const handleDelimiterChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      setDelimiter(event.target.value as string);
    },
    []
  );

  const handleTestConnection = useCallback(() => {
    setAvailableFiles(uploadedFiles);
  }, [uploadedFiles]);

  const handleClear = useCallback(() => {
    setDataType("");
    setSelectedFiles([]);
    setAvailableFiles([]);
    setUploadedFiles([]);
    setDelimiter(",");
  }, []);

  const handleSelectedFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, file: string) => {
      if (event.target.checked) {
        setSelectedFiles((prev) => [...prev, file]);
      } else {
        setSelectedFiles((prev) => prev.filter((f) => f !== file));
      }
    },
    []
  );

  const handleSelectedFileAll = useCallback(
    (select: boolean) => {
      if (select) {
        setSelectedFiles(uploadedFiles);
      } else {
        setSelectedFiles([]);
      }
    },
    [uploadedFiles]
  );

  const checkSelectedFile = useCallback(
    (file: string): boolean | undefined =>
      selectedFiles.some((selectedFile) => selectedFile === file),
    [selectedFiles]
  );

  const scanData = () => {
    // Populate Source Table with table-name
    let sourceTableNode;
    if (selectedFiles.length === 1) {
      const data = sourceTableData;
      const table_name = data.source_tables[0].table_name;
      sourceTableNode = [
        {
          id: `C.0`,
          type: "mappingNode",
          position: { x: 0, y: 0 },
          data: { label: table_name, type: "input" },
          sourcePosition: Position.Right,
        },
      ];
    } else {
      const data = twoSourceTableData;
      sourceTableNode = data.source_tables.map((table, index) => ({
        id: `C.${index + 1}`,
        type: "mappingNode",
        position: { x: 0, y: 0 },
        data: { label: table.table_name, type: "input" },
        tsourcePosition: Position.Right,
      }));
    }

    dispatch({
      type: DispatchType.SET_MAPPING_NODES,
      payload: sourceTableNode,
      stateName: NodeType.TABLE_SOURCE_STATE,
    });
    updateNodeInternals(nodeId);
  };

  const fileNames = useMemo(() => uploadedFiles.join(", "), [uploadedFiles]);

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
              <FormControl
                fullWidth
                variant="standard"
                className="scan-data-dialog__form-control"
              >
                <InputLabel>Data type</InputLabel>
                <Select
                  value={dataType}
                  label="Data type"
                  onChange={handleDataTypeChange}
                >
                  <MenuItem value="csv">CSV files</MenuItem>
                </Select>
              </FormControl>
              {dataType && (
                <>
                  <FormControl
                    fullWidth
                    className="scan-data-dialog__form-control"
                  >
                    <InputLabel>Upload file</InputLabel>
                    <TextField
                      fullWidth
                      variant="standard"
                      InputProps={{
                        readOnly: true,
                      }}
                      onClick={handleSelectFile}
                      value={fileNames}
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

                  <FormControl
                    fullWidth
                    variant="standard"
                    className="scan-data-dialog__form-control"
                  >
                    <InputLabel>Delimeter</InputLabel>
                    <Select
                      label="Delimeter"
                      value={delimiter}
                      onChange={handleDelimiterChange}
                    >
                      <MenuItem value=",">,</MenuItem>
                    </Select>
                  </FormControl>
                  <Button onClick={handleClear}>Clear all</Button>
                </>
              )}
            </div>

            <div className="button-container">
              <Button
                onClick={handleTestConnection}
                variant="outlined"
                disabled={uploadedFiles.length === 0}
              >
                Test Connection
              </Button>
            </div>
          </div>
        </div>
        <div className="scan-data-dialog__container">
          <div className="container-header">Table to Scan</div>
          <div className="container-content-scan">
            {uploadedFiles.length ? (
              <>
                <div className="button-container">
                  <Button onClick={() => handleSelectedFileAll(true)}>
                    Select all
                  </Button>
                  <Button onClick={() => handleSelectedFileAll(false)}>
                    Deselect all
                  </Button>
                </div>
                <FormGroup>
                  {uploadedFiles.map((file) => (
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
        <Button
          onClick={() => handleClose("cancelled")}
          variant="outlined"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          disabled={selectedFiles.length === 0}
          style={{ marginLeft: "20px" }}
        >
          Apply
        </Button>
      </div>
    </Dialog>
  );
};

export default ScanDataDialog;
