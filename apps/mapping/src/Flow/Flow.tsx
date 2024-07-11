import React from "react";
import ReactFlow, { PanOnScrollMode, Controls } from "reactflow";
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

const nodeTypes = {
  sourceTable: SourceTableNode,
  targetTable: TargetTableNode,
  mappingNode: MappingNode,
};
const Flow = () => {
  const { state, dispatch } = useFlow();
  const { tableNodes, tableEdges } = state;

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
          zoomOnScroll={false}
          panOnScroll={false} // change default scroll
          panOnScrollMode={PanOnScrollMode.Vertical} // only allow vertical scrolling
          panOnDrag={false}
          zoomOnPinch={false} // diable mouse on pinch zoom
          fitView
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
