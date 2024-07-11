import React, { createContext, useContext, ReactNode, useReducer } from "react";
import {
  Node,
  Edge,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  NodeProps,
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
        id: "source_menu",
        type: "sourceTable",
        position: { x: 0, y: 0 },
        style: {
          width: "30vw",
          height: "100vh",
        },
        data: null,
      },
      {
        id: "target_menu",
        type: "targetTable",
        position: { x: 900, y: 0 },
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
    fieldNodes: [],
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
        return {
          ...state,
          [action.stateName]: addEdge(action.payload, state[action.stateName]),
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
