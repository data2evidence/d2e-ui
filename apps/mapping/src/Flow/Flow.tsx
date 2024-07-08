import React, { useCallback } from "react";
import ReactFlow, {
  Node,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "./Flow.scss";
import "reactflow/dist/style.css";
import SourceColumnNode from "./Nodes/SourceColumnNode";
import SourceTableNode from "./Nodes/SourceTableNode";
import TargetTableNode from "./Nodes/TargetTableNode";

const nodeTypes = {
  sourceColumn: SourceColumnNode,
  sourceTable: SourceTableNode,
  targetTable: TargetTableNode,
};
const Flow = () => {
  const reactFlow = useReactFlow();

  console.log(reactFlow.getViewport());

  const initialNodes = [
    {
      id: "A",
      type: "sourceColumn",
      position: { x: 0, y: 0 },
      style: {
        width: "25vw",
        height: "100vh",
      },
    },
    {
      id: "B",
      type: "sourceTable",
      position: { x: 500, y: 0 },
      style: {
        width: "25vw",
        height: "100vh",
      },
    },
    {
      id: "C",
      type: "targetTable",
      position: { x: 1000, y: 0 },
      style: {
        width: "25vw",
        height: "100vh",
      },
    },
  ];

  return (
    <div className="flow-container">
      {/* <ReactFlowProvider> */}
      <ReactFlow nodes={initialNodes} nodeTypes={nodeTypes} fitView></ReactFlow>
      {/* </ReactFlowProvider> */}
    </div>
  );
};

export default Flow;
