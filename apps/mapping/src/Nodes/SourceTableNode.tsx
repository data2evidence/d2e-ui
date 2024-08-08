import { useState } from "react";
import { NodeProps } from "reactflow";
import { Button } from "@mui/material";
import { ScanDataDialog } from "../components/ScanDataDialog/ScanDataDialog";
import { ScanProgressDialog } from "../components/ScanProgressDialog/ScanProgressDialog";
import { useTable } from "../contexts";
import { MappingHandle } from "./MappingHandle";
import { CloseDialogType } from "../components/ScanDataDialog/ScanDataDialog";
import "./node.scss";

export const SourceTableNode = (props: NodeProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [scanId, setScanId] = useState<number>(-1);
  const { sourceHandles } = useTable();

  const openScanDataDialog = () => {
    setIsDialogOpen(true);
  };

  const [isScanProgressDialogOpen, setScanProgressDialogOpen] = useState(false);

  const handleScanDataDialogClose = (type: CloseDialogType) => {
    setIsDialogOpen(false);
    if (type === "success") {
      setScanProgressDialogOpen(true);
    }
  };

  const handleBack = () => {
    setScanProgressDialogOpen(false);
    setIsDialogOpen(true);
  };

  const handleScanProgressDialogClose = () => {
    setScanProgressDialogOpen(false);
  };

  return (
    <div className="link-tables__column nodrag">
      <div className="content-container">
        {sourceHandles.length ? (
          <div className="handle-container">
            {sourceHandles.map((node) => (
              <MappingHandle {...node} key={node.id} />
            ))}
          </div>
        ) : (
          <div className="action-container">
            <div className="description">
              Please load New Report to see Source tables
            </div>
            <div className="button-group">
              <Button
                variant="contained"
                fullWidth
                onClick={openScanDataDialog}
              >
                Load New Report
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={openScanDataDialog}
              >
                Scan Data
              </Button>
              <Button variant="contained" fullWidth>
                Open Mapping
              </Button>
            </div>
          </div>
        )}
      </div>
      <ScanDataDialog
        open={isDialogOpen}
        onClose={handleScanDataDialogClose}
        setScanId={setScanId}
      />
      <ScanProgressDialog
        open={isScanProgressDialogOpen}
        onBack={handleBack}
        onClose={handleScanProgressDialogClose}
        nodeId={props.id}
        scanId={scanId}
      />
    </div>
  );
};
