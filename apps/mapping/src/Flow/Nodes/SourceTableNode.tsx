import { Button } from "@mui/material";
import React, { useState } from "react";
import sourceTableData from "../../../dummyData/create_source_schema_scan.json";
import { useFlow } from "../../contexts/FlowContext";
import { Position } from "reactflow";
import ScanDataDialog from "../../ScanDataDialog/ScanDataDialog";
import "./node.scss";

const SourceTableNode = () => {
  const { nodes, setNodes } = useFlow();
  const [loaded, setLoaded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const scanData = () => {
    // Populate Source Table with table-name
    const data = sourceTableData;
    const table_name = data.source_tables[0].table_name;
    const sourceTableNode = {
      id: `C.0`,
      type: "cellNode",
      position: { x: 500, y: 200 },
      style: {
        width: "25vw",
        height: "4vh",
      },
      data: { label: table_name },
      targetPosition: Position.Right,
    };
    setNodes([...nodes, sourceTableNode]);
    setLoaded(true);
  };

  const openScanDataDialog = () => {
    console.log("Open Scan Data");
    setIsDialogOpen(true);
  };

  const closeScanDataDialog = () => {
    setIsDialogOpen(false);
  };
  return (
    <div className="link-tables__column nodrag">
      <h3>Source tables</h3>
      <div className="content-container">
        {!loaded && (
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
              <Button variant="contained" fullWidth onClick={scanData}>
                Scan Data
              </Button>
              <Button variant="contained" fullWidth>
                Open Mapping
              </Button>
            </div>
          </div>
        )}
      </div>
      <ScanDataDialog open={isDialogOpen} onClose={closeScanDataDialog} />
    </div>
  );
};

export default SourceTableNode;
