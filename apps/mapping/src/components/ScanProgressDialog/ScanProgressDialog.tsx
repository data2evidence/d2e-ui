import React, { FC, useEffect, useState, useCallback } from "react";
import { Button, Dialog, DialogTitle, LinearProgress } from "@mui/material";
import { NodeProps, Position, useUpdateNodeInternals } from "reactflow";
import sourceTableData from "../../../dummyData/create_source_schema_scan.json";
import { TableSourceHandleData, useTable } from "../../contexts";
import { CloseDialogType } from "../ScanDataDialog/ScanDataDialog";
import "./ScanProgressDialog.scss";

interface ScanProgressDialogProps {
  open: boolean;
  onBack: () => void;
  onClose?: (type: CloseDialogType) => void;
  nodeId: string;
}

export const ScanProgressDialog: FC<ScanProgressDialogProps> = ({
  open,
  onBack,
  onClose,
  nodeId,
}) => {
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const updateNodeInternals = useUpdateNodeInternals();
  const { setTableSourceHandles } = useTable();

  const handleClose = useCallback(
    (type: CloseDialogType) => {
      typeof onClose === "function" && onClose(type);
    },
    [onClose]
  );

  const handleSaveReport = () => {
    // Handle saving report
    console.log("Report saved");
  };

  const handleLinkTables = () => {
    // TODO: Replace with white-rabbit
    console.log("Tables linked");
    let sourceHandles: Partial<NodeProps<TableSourceHandleData>>[];
    const data = sourceTableData;
    const table_name = data.source_tables[0].table_name;
    sourceHandles = [
      {
        id: `C.0`,
        data: { label: table_name, type: "input" },
        sourcePosition: Position.Right,
      },
    ];

    setTableSourceHandles(sourceHandles);
    updateNodeInternals(nodeId);
    handleClose("success");
  };

  useEffect(() => {
    if (open) {
      // Simulate scan progress
      // TODO: Replace to poll GET /white-rabbit/api/scan-report/conversion/:id
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setLog((prevLog) => [
              ...prevLog,
              "Generating scan report...",
              "Scan report generated!",
              "Scan report file successfully saved",
            ]);
          }
          return newProgress;
        });
      }, 500);

      setLog([
        "Started new scan of 1 tables...",
        "Scanning file concept_mappings.csv",
        "Scanned file concept_mappings.csv",
      ]);
    }
  }, [open]);

  return (
    <Dialog
      className="scan-progress-dialog"
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Scan Data</DialogTitle>
      <div className="scan-progress-dialog__content">
        <div className="scan-progress-dialog__status">
          Scanning... Estimated time depends on selected database
        </div>
        <LinearProgress variant="determinate" value={progress} />
        <div className="scan-progress-dialog__log">
          {log.map((entry, index) => (
            <div key={index}>{entry}</div>
          ))}
        </div>
      </div>
      <div className="scan-progress-dialog__actions">
        <Button onClick={onBack} variant="outlined">
          Back
        </Button>
        <Button onClick={handleSaveReport} variant="contained" color="primary">
          Save report
        </Button>
        <Button onClick={handleLinkTables} variant="contained" color="primary">
          Link tables
        </Button>
      </div>
    </Dialog>
  );
};
