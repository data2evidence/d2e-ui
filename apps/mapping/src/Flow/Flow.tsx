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

const Flow = () => {
  const reactFlow = useReactFlow();

  console.log(reactFlow.fitView());

  const initialNodes = [
    {
      id: "A",
      type: "group",
      data: { label: null },
      position: { x: 0, y: 0 },
      style: {
        width: 170,
        height: "100vh",
      },
    },
    {
      id: "B",
      type: "group",
      data: { label: "child node 1" },
      position: { x: 210, y: 0 },
      style: {
        width: 170,
        height: "100vh",
      },
    },
    // {
    //   id: "C",
    //   type: "group",
    //   data: { label: "child node 2" },
    //   position: { x: 100, y: 0 },
    //   style: {
    //     width: 170,
    //     height: "100vh",
    //   },
    // },
  ];

  return (
    <div className="flow-container">
      {/* <ReactFlowProvider> */}
      <ReactFlow nodes={initialNodes} fitView></ReactFlow>
      {/* </ReactFlowProvider> */}
    </div>
  );
};

export default Flow;
