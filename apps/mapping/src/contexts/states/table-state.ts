import { Node, Edge, NodeProps } from "reactflow";

export interface TableSourceHandleData {
  label: string;
  type: "input";
}

export interface TableTargetHandleData {
  label: string;
  tableName: string;
}

export interface TableState {
  nodes: Node[];
  edges: Edge[];
  sourceHandles: NodeProps<TableSourceHandleData>[];
  targetHandles: NodeProps<TableTargetHandleData>[];
}
