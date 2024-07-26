import { Node, Edge, NodeProps } from "reactflow";

export interface FieldNodeData {
  type: "source" | "target";
}

export interface FieldHandleData {
  label: string;
  tableName: string;
  isField: boolean;
  columnType: string;
  isNullable: boolean;
  type: "input" | "output";
}

export type SourceFieldHandle = FieldHandleData;

export interface TargetFieldHandleData extends FieldHandleData {
  constantValue: string | number | undefined;
}

export interface FieldState {
  nodes: Node<FieldNodeData>[];
  edges: Edge[];
  sourceHandles: NodeProps<SourceFieldHandle>[];
  targetHandles: NodeProps<TargetFieldHandleData>[];
}
