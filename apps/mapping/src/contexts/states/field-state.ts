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

export type FieldSourceHandleData = FieldHandleData;

export interface FieldTargetHandleData extends FieldHandleData {
  constantValue?: string | number;
  comment?: string;
}

export type FieldSourceState = NodeProps<FieldSourceHandleData>;
export type FieldTargetState = NodeProps<FieldTargetHandleData>;

export interface FieldState {
  nodes: Node<FieldNodeData>[];
  edges: Edge[];
  sourceHandles: FieldSourceState[];
  targetHandles: FieldTargetState[];
}
