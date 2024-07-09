import React from "react";
import { NodeProps, Handle, Position } from "reactflow";
import "./CellNode.scss";

interface NodeDataState {
  label: string;
  id: string;
  targetPosition: Position;
}

export interface CellNodeData extends NodeDataState {}

const CellNode = (node: NodeProps<CellNodeData>) => {
  const { data, targetPosition } = node;
  console.log(data);
  return (
    <div className="cell nodrag">
      <div className="content">{data.label}</div>
      {targetPosition === Position.Left && (
        <Handle type="source" position={Position.Left} id="a" />
      )}
      {targetPosition === Position.Right && (
        <Handle type="target" position={Position.Right} id="a" />
      )}
    </div>
  );
};

export default CellNode;
