import { useCallback } from "react";
import ReactFlow, { Controls, Edge, PanOnScrollMode, Position, Panel } from "reactflow";
import { useNavigate } from "react-router-dom";
import { nodeTypes } from "../Nodes";
import { FieldHandleData, TableSchemaState, useCdmSchema, useField, useScannedSchema, useTable } from "../contexts";
import { Box } from "@portal/components";
import { MenuButton } from "../components/MenuButton/MenuButton";
import "./TableMapLayout.scss";
import "reactflow/dist/style.css";

export const TableMapLayout = () => {
  const { nodes, edges, setTableNodes, setTableEdges, addTableConnection } = useTable();
  const { setFieldSourceHandles, setFieldTargetHandles } = useField();
  const { sourceTables } = useScannedSchema();
  const { cdmTables } = useCdmSchema();
  const navigate = useNavigate();

  const handleEdgeClick = useCallback(
    (_event: any, edge: Edge) => {
      const { sourceHandle, targetHandle } = edge;

      if (!sourceHandle || !targetHandle) {
        console.error(`Source (${sourceHandle}) or target (${targetHandle}) handles are empty`);
        return;
      }

      const sourceColumns = getColumns(sourceTables, sourceHandle);
      const targetColumns = getColumns(cdmTables, targetHandle);

      const sourceHandles = buildFieldHandle(sourceColumns, sourceHandle, true);
      const targetHandles = buildFieldHandle(targetColumns, targetHandle, false);

      setFieldSourceHandles(sourceHandles);
      setFieldTargetHandles(targetHandles);

      navigate("link-fields");
    },
    [sourceTables, cdmTables]
  );

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
          panOnScrollMode={PanOnScrollMode.Horizontal}
          panOnScroll
          panOnDrag={false}
          zoomOnPinch={false}
          fitView
          maxZoom={1}
          minZoom={1}
          onEdgeDoubleClick={handleEdgeClick}
        >
          <Controls showZoom={false} showInteractive={false} />
          <Panel position="top-left" className="panel">
            <Box className="flow-panel__custom-controls">
              <MenuButton />
            </Box>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

const getColumns = (tables: TableSchemaState[], tableName: string) => {
  const table = tables.find((t) => t.table_name === tableName);
  return table?.column_list || [];
};

const buildFieldHandle = (columnList: any[], tableName: string, isSource?: boolean) =>
  columnList.map((column, index) => ({
    id: `FIELD.${index + 1}`,
    data: {
      label: column.column_name,
      tableName: tableName,
      isField: true,
      columnType: column.column_type,
      isNullable: column.is_column_nullable,
      type: isSource ? "input" : "output",
    } as FieldHandleData,
    targetPosition: isSource ? Position.Right : Position.Left,
  }));
