import React, { useCallback } from "react";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  Connection,
  PanOnScrollMode,
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

  const { nodes, setNodes, edges, setEdges } = useFlow();

  const handleConnect = useCallback(
    (params: Connection) => {
      const updates = addEdge(params, edges);
      setEdges(updates);
    },
    [edges]
  );

  return (
    <div className="flow-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={(changes) =>
          setNodes((nds) => applyNodeChanges(changes, nds))
        }
        onEdgesChange={(changes) => {
          setEdges((edges) => applyEdgeChanges(changes, edges));
        }}
        onConnect={handleConnect}
        panOnScroll={true} // change default scroll
        panOnScrollMode={PanOnScrollMode.Vertical} // only allow vertical scrolling
        panOnDrag={false}
        zoomOnPinch={false} // diable mouse on pinch zoom
        translateExtent={[
          // restrict scroll area within the canvas
          [-500, 0],
          [1500, 900],
        ]}
        fitView
      ></ReactFlow>
    </div>
  );
};

export default Flow;
