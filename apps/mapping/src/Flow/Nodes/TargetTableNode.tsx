import { Button } from "@mui/material";
import React, { useCallback } from "react";
import targetSourceData from "../../../dummyData/5.4Version.json";
import "./node.scss";
import { DispatchType, NodeType, useFlow } from "../../contexts/FlowContext";
import { NodeProps, useUpdateNodeInternals } from "reactflow";
import { MappingNode } from "./MappingNode";

const TargetTableNode = (props: NodeProps) => {
  const { state, dispatch } = useFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  // Populate version 5.4
  const populateCDMVersion = useCallback(() => {
    // TODO: Create other version of CDM selection
    const data = targetSourceData;
    const targetTableNodes = data.map((table, index) => ({
      id: `C.${index + 1}`,
      type: "mappingNode",
      position: { x: 900, y: 0 + index * 50 },
      data: { label: table.table_name },
      targetPosition: "left",
    }));

    dispatch({
      type: DispatchType.SET_MAPPING_NODES,
      payload: targetTableNodes,
      stateName: NodeType.TABLE_TARGET_STATE,
    });

    updateNodeInternals(props.id);
  }, []);

  return (
    <div
      className="link-tables__column nodrag nowheel"
      onWheel={() => updateNodeInternals(props.id)}
    >
      <div className="content-container">
        {state.tableTargetState.length ? (
          <div className="node-container">
            {state.tableTargetState.map((node) => (
              <MappingNode {...node} key={node.id} />
            ))}
          </div>
        ) : (
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
      </div>
    </div>
  );
};

export default TargetTableNode;
