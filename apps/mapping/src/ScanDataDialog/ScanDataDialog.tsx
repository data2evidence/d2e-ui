import React, { FC, useCallback, useState } from "react";
import {
  Button,
  Dialog,
  TableCell,
  TableRow,
  InputLabel,
  ListItemText,
} from "@mui/material";
import sourceTableData from "../../dummyData/create_source_schema_scan.json";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
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
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]); // used for test connection, consider removing if test connection is not used
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [delimiter, setDelimiter] = useState(",");
  const updateNodeInternals = useUpdateNodeInternals();

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setSelectedFiles([]);
      setAvailableFiles([]);
      setDelimiter(",");
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

  const handleFileChange = useCallback((event: SelectChangeEvent<string[]>) => {
    setAvailableFiles(event.target.value as string[]);
  }, []);

  const handleFileUpload = (event: any) => {
    const files = Array.from(event.target.files).map((file: any) => file.name);
    setUploadedFiles(files);
  };

  const handleDelimiterChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      setDelimiter(event.target.value as string);
    },
    []
  );

  const handleTestConnection = useCallback(() => {
    setAvailableFiles(uploadedFiles);
  }, [uploadedFiles]);

  const scanData = () => {
    // Populate Source Table with table-name
    const data = sourceTableData;
    const table_name = data.source_tables[0].table_name;
    const sourceTableNode = [
      {
        id: `C.0`,
        type: "mappingNode",
        position: { x: 0, y: 0 },
        data: { label: table_name, type: "input" },
        sourcePosition: Position.Right,
      },
    ];
    dispatch({
      type: DispatchType.SET_MAPPING_NODES,
      payload: sourceTableNode,
      stateName: NodeType.TABLE_SOURCE_STATE,
    });
    updateNodeInternals(nodeId);
  };

  return (
    <Dialog
      className="scan-data-dialog"
      title="Scan Data"
      open={open}
      onClose={() => handleClose("cancelled")}
      maxWidth="md"
    >
      <Divider />
      <div className="scan-data-dialog__content">
        <div className="scan-data-dialog__section">
          <h3>Scan Data</h3>
          {/* <FormControl
            fullWidth
            variant="outlined"
            className="scan-data-dialog__form-control"
          >
            <Select label="Data Type" value="CSV files" disabled>
              <MenuItem value="CSV files">CSV files</MenuItem>
            </Select>
          </FormControl> */}
          <FormControl
            fullWidth
            variant="outlined"
            className="scan-data-dialog__form-control"
          >
            <InputLabel>CSV files</InputLabel>
            <Select
              multiple
              label="Select Files"
              value={uploadedFiles}
              onChange={handleFileChange}
              renderValue={(selected) => (selected as string[]).join(", ")}
            >
              {uploadedFiles.map((file) => (
                <MenuItem key={file} value={file}>
                  <Checkbox checked={selectedFiles.indexOf(file) > -1} />
                  <ListItemText primary={file} />
                </MenuItem>
              ))}
              <MenuItem>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  id="upload-csv"
                  multiple
                />
                <label htmlFor="upload-csv">
                  <Button variant="contained" component="span">
                    Upload CSV
                  </Button>
                </label>
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            variant="outlined"
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
          <Button onClick={handleTestConnection} variant="outlined">
            Test Conncetion
          </Button>
        </div>
        <div className="scan-data-dialog__section">
          <h3>Table to Scan</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    indeterminate={
                      selectedFiles.length > 0 && selectedFiles.length < 3
                    }
                    checked={selectedFiles.length === availableFiles.length}
                    onChange={() =>
                      setSelectedFiles(
                        selectedFiles.length === availableFiles.length
                          ? []
                          : availableFiles
                      )
                    }
                  />
                </TableCell>
                <TableCell>File Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {availableFiles.map((file) => (
                <TableRow key={file}>
                  <TableCell>
                    <Checkbox
                      checked={selectedFiles.indexOf(file) > -1}
                      onChange={() => {
                        const currentIndex = selectedFiles.indexOf(file);
                        const newChecked = [...selectedFiles];
                        if (currentIndex === -1) {
                          newChecked.push(file);
                        } else {
                          newChecked.splice(currentIndex, 1);
                        }
                        setSelectedFiles(newChecked);
                      }}
                    />
                  </TableCell>
                  <TableCell>{file}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
