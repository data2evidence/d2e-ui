import { useState } from "react";
import { NodeProps } from "reactflow";
import { Button } from "@mui/material";
import ScanDataDialog from "../../ScanDataDialog/ScanDataDialog";
import { useTable } from "../../contexts";
import { MappingNode } from "./MappingNode";
import "./node.scss";

const SourceTableNode = (props: NodeProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { sourceHandles } = useTable();

  const openScanDataDialog = () => {
    setIsDialogOpen(true);
  };

  const closeScanDataDialog = () => {
    setIsDialogOpen(false);
  };
  return (
    <div className="link-tables__column nodrag">
      <div className="content-container">
        {sourceHandles.length ? (
          <div className="node-container">
            {sourceHandles.map((node) => (
              <MappingNode {...node} key={node.id} />
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
        onClose={closeScanDataDialog}
        nodeId={props.id}
      />
    </div>
  );
};

export default SourceTableNode;
