import React, { useState } from "react";
import sourceTableData from "../../../dummyData/create_source_schema_scan.json";
import { DispatchType, NodeType, useFlow } from "../../contexts/FlowContext";
import { NodeProps, Position, useUpdateNodeInternals } from "reactflow";
import ScanDataDialog from "../../ScanDataDialog/ScanDataDialog";
import { Button } from "@mui/material";
import { MappingNode } from "./MappingNode";
import "./node.scss";

const SourceTableNode = (props: NodeProps) => {
  const { state, dispatch } = useFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      {
        id: `C.1`,
        type: "mappingNode",
        position: { x: 0, y: 0 },
        data: { label: "c2", type: "input" },
        sourcePosition: Position.Right,
      },
    ];
    dispatch({
      type: DispatchType.SET_MAPPING_NODES,
      payload: sourceTableNode,
      stateName: NodeType.TABLE_SOURCE_STATE,
    });
    updateNodeInternals(props.id);
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
