import React from "react";
import ReactFlow, {
  Node,
  ReactFlowProvider,
  addEdge,
  applyNodeChanges,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "./Flow.scss";
import "reactflow/dist/style.css";
import SourceColumnNode from "./Nodes/SourceColumnNode";
import SourceTableNode from "./Nodes/SourceTableNode";
import TargetTableNode from "./Nodes/TargetTableNode";
import CellNode from "./Nodes/CellNode";
import { useFlow } from "../contexts/FlowContext";

const nodeTypes = {
  sourceColumn: SourceColumnNode,
  sourceTable: SourceTableNode,
  targetTable: TargetTableNode,
  cellNode: CellNode,
};
const Flow = () => {
  const reactFlow = useReactFlow();

  console.log(reactFlow.getViewport());

  const { nodes, setNodes } = useFlow();

  return (
    <div className="flow-container">
      <ReactFlowProvider>
        {/* <FlowProvider> */}
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={(changes) =>
            setNodes((nds) => applyNodeChanges(changes, nds))
          }
          fitView
        ></ReactFlow>
        {/* </FlowProvider> */}
      </ReactFlowProvider>
    </div>
  );
};

export default Flow;
