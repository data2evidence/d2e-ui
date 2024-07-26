import { useEffect } from "react";
import ReactFlow, { Controls } from "reactflow";
import { useNavigate } from "react-router-dom";
import { nodeTypes } from "../Nodes";
import { useField } from "../contexts";
import { TableToTable } from "./TableToTable";
import "./FieldMapLayout.scss";

export const FieldMapLayout = () => {
  const {
    nodes,
    edges,
    sourceHandles,
    targetHandles,
    setFieldNodes,
    setFieldEdges,
    addFieldConnection,
  } = useField();
  const navigate = useNavigate();

  useEffect(() => {
    if (sourceHandles?.length == 0 || targetHandles?.length === 0) {
      navigate("/");
    }
  }, [sourceHandles, targetHandles]);

  const sourceTableName = sourceHandles?.length
    ? sourceHandles[0].data.tableName
    : "";
  const targetTableName = targetHandles?.length
    ? targetHandles[0].data.tableName
    : "";

  return (
    <div className="field-map-layout">
      <TableToTable source={sourceTableName} target={targetTableName} />
      <div className="react-flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={(changes) => setFieldNodes(changes)}
          onEdgesChange={(changes) => setFieldEdges(changes)}
          onConnect={(changes) => addFieldConnection(changes)}
          zoomOnDoubleClick={false}
          zoomOnScroll={false}
          panOnScroll={false}
          zoomOnPinch={false}
          fitView
        >
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};
