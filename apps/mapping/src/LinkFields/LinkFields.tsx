import React from "react";
import ReactFlow, { Controls } from "reactflow";
import { nodeTypes } from "../Flow/Flow";
import {
  DispatchType,
  EdgeType,
  NodeType,
  useFlow,
} from "../contexts/FlowContext";
import { LinkFieldsHeader } from "./LinkFieldsHeader";

export const LinkFields = () => {
  const { state, dispatch } = useFlow();
  const { fieldNodes, fieldEdges } = state;

  const sourceTableName = state.fieldSourceState[0].data.tableName;
  const targetTableName = state.fieldTargetState[0].data.tableName;

  return (
    <div className="flow-container">
      <LinkFieldsHeader source={sourceTableName} target={targetTableName} />
      <div className="react-flow-container">
        <ReactFlow
          nodes={fieldNodes}
          edges={fieldEdges}
          nodeTypes={nodeTypes}
          onNodesChange={(changes) =>
            dispatch({
              type: DispatchType.HANDLE_NODES_CHANGE,
              payload: changes,
              stateName: NodeType.FIELD_NODES,
            })
          }
          onEdgesChange={(changes) =>
            dispatch({
              type: DispatchType.HANDLE_EDGES_CHANGE,
              payload: changes,
              stateName: EdgeType.FIELD_EDGES,
            })
          }
          onConnect={(changes) =>
            dispatch({
              type: DispatchType.HANDLE_CONNECT,
              payload: changes,
              stateName: EdgeType.FIELD_EDGES,
            })
          }
          zoomOnDoubleClick={false}
          zoomOnScroll={false}
          panOnScroll={false}
          zoomOnPinch={false}
          fitView
        >
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};
