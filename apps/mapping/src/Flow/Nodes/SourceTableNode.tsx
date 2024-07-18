import { useState } from "react";
import { useFlow } from "../../contexts/FlowContext";
import { NodeProps } from "reactflow";
import ScanDataDialog from "../../ScanDataDialog/ScanDataDialog";
import { Button } from "@mui/material";
import { MappingNode } from "./MappingNode";
import "./node.scss";

const SourceTableNode = (props: NodeProps) => {
  const { state, dispatch } = useFlow();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openScanDataDialog = () => {
    console.log("Open Scan Data");
    setIsDialogOpen(true);
  };

  const closeScanDataDialog = () => {
    setIsDialogOpen(false);
  };
  return (
    <div className="link-tables__column nodrag">
      <div className="content-container">
        {state.tableSourceState.length ? (
          <div className="node-container">
            {state.tableSourceState.map((node) => (
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
        dispatch={dispatch}
      />
    </div>
  );
};

export default SourceTableNode;
