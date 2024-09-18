import { useEffect, useCallback } from "react";
import ReactFlow, { Controls, EdgeChange, PanOnScrollMode } from "reactflow";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { ManageSearch } from "@mui/icons-material";
import { nodeTypes } from "../Nodes";
import { useField } from "../contexts";
import { TableToTable } from "./TableToTable";
import "./FieldMapLayout.scss";

export const FieldMapLayout = () => {
  const { nodes, edges, sourceHandles, targetHandles, setFieldNodes, setFieldEdges, addFieldConnection } = useField();
  const navigate = useNavigate();

  useEffect(() => {
    if (sourceHandles?.length == 0 || targetHandles?.length === 0) {
      navigate("/");
    }
  }, [sourceHandles, targetHandles]);

  const sourceTableName = sourceHandles?.length ? sourceHandles[0].data.tableName : "";
  const targetTableName = targetHandles?.length ? targetHandles[0].data.tableName : "";

  const deleteLinks = useCallback(() => {
    const edgeChanges: EdgeChange[] = edges.map((edge) => ({
      id: edge.id,
      type: "remove",
    }));
    setFieldEdges(edgeChanges);
  }, [setFieldEdges, edges]);

  return (
    <div className="field-map-layout">
      <TableToTable source={sourceTableName} target={targetTableName} />
      <div className="react-flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={(changes) => setFieldNodes(changes)}
          onEdgesChange={(changes) => setFieldEdges(changes)}
          onConnect={(changes) => addFieldConnection(changes)}
          zoomOnDoubleClick={false}
          zoomOnScroll={false}
          panOnScrollMode={PanOnScrollMode.Horizontal}
          panOnScroll
          panOnDrag={false}
          zoomOnPinch={false}
          fitView
          maxZoom={1}
          minZoom={1}
        >
          <Controls showZoom={false} showInteractive={false} />
        </ReactFlow>
      </div>

      <div className="footer">
        <Button aria-label="managesearch">
          <ManageSearch />
          Vocabulary
        </Button>
        <div className="button-group">
          <Button variant="outlined" color="error" onClick={deleteLinks}>
            Delete links
          </Button>
          <Button variant="outlined">Preview</Button>
          <Button variant="outlined">Generate Fake Data</Button>
          <Button variant="outlined">Report</Button>
          <Button variant="contained">Convert to CDM</Button>
        </div>
      </div>
    </div>
  );
};
