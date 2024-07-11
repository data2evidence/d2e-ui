import { Edge } from "reactflow";
import cdmData from "../../dummyData/5.4Version.json";
import inputData from "../../dummyData/create_source_schema_scan.json";

export const buildFieldNodes = (edge: Edge) => {
  const { sourceHandle, targetHandle } = edge;

  const sourceFieldNodes = buildFieldNode(
    getColumnData(sourceHandle),
    sourceHandle,
    true
  );
  const targetFieldNodes = buildFieldNode(
    getColumnData(targetHandle, true),
    targetHandle
  );

  return { sourceFieldNodes, targetFieldNodes };
};

const buildFieldNode = (
  columnList: any[],
  tableName: string | null | undefined,
  isSource?: boolean
) =>
  columnList.map((column, index) => ({
    id: `FIELD.${index + 1}`,
    data: {
      label: column.column_name,
      tableName: tableName,
      isField: true,
      columnType: column.column_type,
      isNullable: column.is_column_nullable,
      type: isSource ? "input" : "output",
    },
    targetPosition: isSource ? "right" : "left",
  }));

const getColumnData = (
  tableName: string | null | undefined,
  isCDM?: boolean
) => {
  let table;
  if (isCDM) {
    table = cdmData.find((data) => data.table_name === tableName);
  } else {
    table = inputData.source_tables.find(
      (data) => data.table_name === tableName
    );
  }
  return table?.column_list || [];
};
