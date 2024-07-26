import { useCallback } from "react";
import ReactFlow, { Controls, Edge } from "reactflow";
import { useNavigate } from "react-router-dom";
import { nodeTypes } from "../Nodes";
import { buildFieldHandles } from "../utils/nodes";
import { useField, useTable } from "../contexts";
import "./TableMapLayout.scss";
import "reactflow/dist/style.css";

export const TableMapLayout = () => {
  const { nodes, edges, setTableNodes, setTableEdges, addTableConnection } =
    useTable();
  const { setFieldSourceHandles, setFieldTargetHandles } = useField();
  const navigate = useNavigate();

  const handleEdgeClick = useCallback((_event: any, edge: Edge) => {
    const handles = buildFieldHandles(edge);
    if (!handles) return;

    const { sourceHandles, targetHandles } = handles;
    setFieldSourceHandles(sourceHandles);
    setFieldTargetHandles(targetHandles);

    navigate("/link-fields");
  }, []);

  return (
    <div className="table-map-layout">
      <div className="react-flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={(changes) => setTableNodes(changes)}
          onEdgesChange={(changes) => setTableEdges(changes)}
          onConnect={(changes) => addTableConnection(changes)}
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
