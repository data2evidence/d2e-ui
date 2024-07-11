import React, { FC, useCallback, useState, ChangeEvent } from "react";
import {
  Button,
  Dialog,
  TableCell,
  TableRow,
  InputLabel,
  ListItemText,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
// import { CloseDialogType } from "../../../../types";
// import { api } from "../../../../axios/api";
import "./ScanDataDialog.scss";
// import { useTranslation } from "../../../../contexts";

type CloseDialogType = "success" | "cancelled";
interface ScanDataDialogProps {
  open: boolean;
  onClose?: (type: CloseDialogType) => void;
}

const ScanDataDialog: FC<ScanDataDialogProps> = ({ open, onClose }) => {
  // const { getText, i18nKeys } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [delimiter, setDelimiter] = useState(",");

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      setSelectedFiles([]);
      setDelimiter(",");
      typeof onClose === "function" && onClose(type);
    },
    [onClose]
  );

  const handleApply = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Uncomment and replace with actual data scanning logic

      // await api.data.scanData(selectedFiles, delimiter);
      handleClose("success");
    } catch (err: any) {
      console.error("err", err);
    } finally {
      setLoading(false);
    }
  }, [selectedFiles, delimiter, handleClose]);

  const handleFileChange = useCallback((event: SelectChangeEvent<string[]>) => {
    setSelectedFiles(event.target.value as string[]);
  }, []);

  const handleFileUpload = (event: any) => {
    const files = Array.from(event.target.files).map((file: any) => file.name);
    setAvailableFiles(files);
  };

  const handleDelimiterChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      setDelimiter(event.target.value as string);
    },
    []
  );

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
              value={availableFiles}
              onChange={handleFileChange}
              renderValue={(selected) => (selected as string[]).join(", ")}
            >
              {availableFiles.map((file) => (
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
          <Button
            onClick={() => console.log("Test Connection")}
            variant="outlined"
          >
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
        <Button onClick={handleApply} disabled={selectedFiles.length === 0}>
          Apply
        </Button>
      </div>
    </Dialog>
  );
};

export default ScanDataDialog;
