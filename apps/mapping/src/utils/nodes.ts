import { Edge, Position } from "reactflow";
import cdmData from "../../dummyData/5.4Version.json";
import inputData from "../../dummyData/healthcare_and_concept.json";
import { FieldHandleData } from "../contexts";

// TODO: Replace the dummy data from reading from endpoint
export const buildFieldHandles = (edge: Edge) => {
  const { sourceHandle, targetHandle } = edge;

  if (!sourceHandle || !targetHandle) {
    console.error(
      `Source (${sourceHandle}) or target (${targetHandle}) handles are empty`
    );
    return;
  }

  const sourceHandles = buildFieldHandle(
    getColumnData(sourceHandle),
    sourceHandle,
    true
  );
  const targetHandles = buildFieldHandle(
    getColumnData(targetHandle, true),
    targetHandle
  );

  return { sourceHandles, targetHandles };
};

const buildFieldHandle = (
  columnList: any[],
  tableName: string,
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
    } as FieldHandleData,
    targetPosition: isSource ? Position.Right : Position.Left,
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
