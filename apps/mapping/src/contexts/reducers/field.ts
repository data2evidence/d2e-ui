import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  EdgeChange,
  MarkerType,
  NodeChange,
  NodeProps,
} from "reactflow";
import { AppState } from "../states";
import { FieldHandleData, TargetFieldHandleData } from "../states/field-state";

export const setFieldNodes = (
  state: AppState,
  payload: NodeChange[]
): AppState => ({
  ...state,
  field: {
    ...state.field,
    nodes: applyNodeChanges(payload, state.field.nodes),
  },
});

export const setFieldEdges = (
  state: AppState,
  payload: EdgeChange[]
): AppState => ({
  ...state,
  field: {
    ...state.field,
    edges: applyEdgeChanges(payload, state.field.edges),
  },
});

export const addFieldConnection = (
  state: AppState,
  payload: Connection
): AppState => {
  const edge = {
    ...payload,
    style: {
      strokeWidth: 2,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
    },
  };

  return {
    ...state,
    field: {
      ...state.field,
      edges: addEdge(edge, state.field.edges),
    },
  };
};

export const setFieldSourceHandles = (
  state: AppState,
  payload: NodeProps<FieldHandleData>[]
): AppState => ({
  ...state,
  field: {
    ...state.field,
    sourceHandles: payload,
  },
});

export const setFieldTargetHandles = (
  state: AppState,
  payload: NodeProps<TargetFieldHandleData>[]
): AppState => ({
  ...state,
  field: {
    ...state.field,
    targetHandles: payload,
  },
});
