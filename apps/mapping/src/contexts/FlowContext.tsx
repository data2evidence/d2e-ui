import React, { createContext, useContext, ReactNode, useReducer } from "react";
import {
  Node,
  Edge,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  NodeProps,
  MarkerType,
} from "reactflow";

interface FlowContextType {
  state: FlowContextStateType;
  dispatch: React.Dispatch<any>;
}

interface FlowContextStateType {
  tableSourceState: NodeProps[];
  tableTargetState: NodeProps[];
  tableNodes: Node[];
  tableEdges: Edge[];
  fieldSourceState: NodeProps[];
  fieldTargetState: NodeProps[];
  fieldNodes: Node[];
  fieldEdges: Edge[];
}

interface FlowReducerActionType {
  type: string;
  payload: any;
  stateName: string;
}
const FlowContext = createContext<FlowContextType | undefined>(undefined);

export enum DispatchType {
  HANDLE_NODES_CHANGE = "handleNodesChange",
  HANDLE_EDGES_CHANGE = "handleEdgesChange",
  HANDLE_CONNECT = "handleConnect",
  UPDATE_NODES = "updateNodes",
  SET_MAPPING_NODES = "setMappingNodes",
  RESET_MAPPING = "resetMapping",
  CLEAR_MAPPINGS = "clearMappings",
}
export enum NodeType {
  TABLE_NODES = "tableNodes",
  TABLE_SOURCE_STATE = "tableSourceState",
  TABLE_TARGET_STATE = "tableTargetState",
  FIELD_NODES = "fieldNodes",
  FIELD_SOURCE_STATE = "fieldSourceState",
  FIELD_TARGET_STATE = "fieldTargetState",
}
export enum EdgeType {
  TABLE_EDGES = "tableEdges",
  FIELD_EDGES = "fieldEdges",
}

export const FlowProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const initialState: FlowContextStateType = {
    tableNodes: [
      {
        id: "table_source_menu",
        type: "sourceTable",
        position: { x: 0, y: 0 },
        style: {
          width: "30vw",
          height: "100vh",
        },
        data: null,
      },
      {
        id: "table_target_menu",
        type: "targetTable",
        position: { x: 700, y: 0 },
        style: {
          width: "30vw",
          height: "100vh",
        },
        data: null,
      },
    ],
    tableEdges: [],
    tableSourceState: [],
    tableTargetState: [],
    fieldNodes: [
      {
        id: "field_source_menu",
        type: "placeholderNode",
        position: { x: 0, y: 0 },
        style: {
          width: "30vw",
          height: "100vh",
        },
        data: { type: "source" },
      },
      {
        id: "field_target_menu",
        type: "placeholderNode",
        position: { x: 700, y: 0 },
        style: {
          width: "30vw",
          height: "100vh",
        },
        data: { type: "target" },
      },
    ],
    fieldEdges: [],
    fieldSourceState: [],
    fieldTargetState: [],
  };

  const reducer = (state: any, action: FlowReducerActionType) => {
    switch (action.type) {
      case DispatchType.HANDLE_NODES_CHANGE:
        return {
          ...state,
          [action.stateName]: applyNodeChanges(
            action.payload,
            state[action.stateName]
          ),
        };
      case DispatchType.HANDLE_EDGES_CHANGE:
        return {
          ...state,
          [action.stateName]: applyEdgeChanges(
            action.payload,
            state[action.stateName]
          ),
        };
      case DispatchType.HANDLE_CONNECT:
        const edge = {
          ...action.payload,
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
          [action.stateName]: addEdge(edge, state[action.stateName]),
        };
      case DispatchType.UPDATE_NODES:
        return {
          ...state,
          [action.stateName]: [...state[action.stateName], ...action.payload],
        };
      case DispatchType.SET_MAPPING_NODES:
        return {
          ...state,
          [action.stateName]: action.payload,
        };
      case DispatchType.RESET_MAPPING:
        return initialState;
      case DispatchType.CLEAR_MAPPINGS:
        return {
          ...state,
          tableEdges: [],
          fieldEdges: [],
        };
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FlowContext.Provider value={{ state, dispatch }}>
      {children}
    </FlowContext.Provider>
  );
};

export const useFlow = (): FlowContextType => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlow must be used within a FlowProvider");
  }
  return context;
};
