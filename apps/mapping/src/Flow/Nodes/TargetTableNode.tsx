import { Button } from "@mui/material";
import React, { useCallback } from "react";
import targetSourceData from "../../../dummyData/5.4Version.json";
import "./node.scss";
import { useFlow } from "../../contexts/FlowContext";
import { Position } from "reactflow";

const TargetTableNode = () => {
  const { nodes, setNodes } = useFlow();

  // Populate version 5.4
  const populateCDMVersion = useCallback(() => {
    // TODO: Create other version of CDM selection
    const data = targetSourceData;
    const targetTableNodes = data.map((table, index) => ({
      id: `C.${index + 1}`,
      type: "cellNode",
      position: { x: 1000, y: 200 + index * 35 },
      style: {
        width: "25vw",
        height: "4vh",
      },
      data: { label: table.table_name },
      targetPosition: Position.Left,
    }));
    setNodes((nds) => [...nds, ...targetTableNodes]);
  }, [nodes, targetSourceData, setNodes]);
  return (
    <div className="link-tables__column nodrag">
      <h3>Target tables</h3>
      <div className="content-container">
        {nodes.length <= 4 && (
          <div className="action-container">
            <div className="description">
              Please select CDM version to see Target tables
            </div>
            <div className="button-group">
              <Button
                variant="contained"
                fullWidth
                onClick={populateCDMVersion}
              >
                Version 5.4
              </Button>
              <Button variant="contained" fullWidth>
                Version 5.3.1
              </Button>
              <Button variant="contained" fullWidth>
                Select Other Version
              </Button>
            </div>
          </div>
        )}
        <div className="targetTable"></div>
      </div>
    </div>
  );
};

export default TargetTableNode;
