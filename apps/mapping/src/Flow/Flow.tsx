import React, { useCallback } from "react";
import ReactFlow, { Controls, Edge } from "reactflow";
import "./Flow.scss";
import "reactflow/dist/style.css";
import SourceTableNode from "./Nodes/SourceTableNode";
import TargetTableNode from "./Nodes/TargetTableNode";
import {
  DispatchType,
  EdgeType,
  NodeType,
  useFlow,
} from "../contexts/FlowContext";
import { MappingNode } from "./Nodes/MappingNode";
import { buildFieldNodes } from "../utils/nodes";
import { useNavigate } from "react-router-dom";

export const nodeTypes = {
  sourceTable: SourceTableNode,
  targetTable: TargetTableNode,
  mappingNode: MappingNode,
};

const Flow = () => {
  const { state, dispatch } = useFlow();
  const { tableNodes, tableEdges } = state;
  const navigate = useNavigate();

  const handleEdgeClick = useCallback((event: any, edge: Edge) => {
    const { sourceFieldNodes, targetFieldNodes } = buildFieldNodes(edge);

    dispatch({
      type: DispatchType.SET_MAPPING_NODES,
      payload: sourceFieldNodes,
      stateName: NodeType.FIELD_SOURCE_STATE,
    });

    dispatch({
      type: DispatchType.SET_MAPPING_NODES,
      payload: targetFieldNodes,
      stateName: NodeType.FIELD_TARGET_STATE,
    });

    dispatch({
      type: DispatchType.SET_FIELD_PAGE,
      payload: true,
      stateName: NodeType.FIELD_PAGE_STATE,
    });

    navigate("/link-fields");
  }, []);

  return (
    <div className="flow-container">
      <div className="react-flow-container">
        <ReactFlow
          nodes={tableNodes}
          edges={tableEdges}
          nodeTypes={nodeTypes}
          onNodesChange={(changes) =>
            dispatch({
              type: DispatchType.HANDLE_NODES_CHANGE,
              payload: changes,
              stateName: NodeType.TABLE_NODES,
            })
          }
          onEdgesChange={(changes) =>
            dispatch({
              type: DispatchType.HANDLE_EDGES_CHANGE,
              payload: changes,
              stateName: EdgeType.TABLE_EDGES,
            })
          }
          onConnect={(changes) =>
            dispatch({
              type: DispatchType.HANDLE_CONNECT,
              payload: changes,
              stateName: EdgeType.TABLE_EDGES,
            })
          }
          zoomOnDoubleClick={false}
          zoomOnScroll={false}
          panOnScroll={false} // change default scroll
          zoomOnPinch={false} // diable mouse on pinch zoom
          fitView
          onEdgeDoubleClick={handleEdgeClick}
        >
          <Controls />
        </ReactFlow>
      </div>

      {/* <div className="footer">
        <IconButton>
          <ManageSearch />
        </IconButton>
        {tableNodes.length !== 0 && (
          <div className="button-group">
            <Button variant="contained" disabled>
              Delete mapping
            </Button>
            <Button variant="contained" disabled>
              Go to link fields
            </Button>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Flow;
