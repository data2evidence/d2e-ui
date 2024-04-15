import React, { FC, useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";

import "./TreeMapTable.scss";
import { TranslationContext } from "../../../../contexts/TranslationContext";

interface TreeMapTableProps {
  data: any;
  setSelectedConceptId: (value: string) => void;
}
const TreeMapTable: FC<TreeMapTableProps> = ({ data, setSelectedConceptId }) => {
  const { getText, i18nKeys } = TranslationContext();
  // column properties
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "CONCEPT_ID",
        header: getText(i18nKeys.TREE_MAP_TABLE__HEADER_CONCEPT_ID),
        maxSize: 75,
        Cell: ({ cell }) => (
          <div className="concept_id_text" onClick={() => setSelectedConceptId(cell.getValue<string>())}>
            {cell.getValue<string>()}
          </div>
        ),
      },
      {
        accessorKey: "CONCEPT_PATH",
        header: getText(i18nKeys.TREE_MAP_TABLE__HEADER_CONCEPT_PATH),
      },
      {
        accessorKey: "NUM_PERSONS",
        header: getText(i18nKeys.TREE_MAP_TABLE__HEADER_NUM_PERSONS),
        maxSize: 75,
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
      },
      {
        accessorKey: "PERCENT_PERSONS",
        header: getText(i18nKeys.TREE_MAP_TABLE__HEADER_PERCENT_PERSONS),
        maxSize: 75,
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
      },
      {
        accessorKey: "RECORDS_PER_PERSON",
        header: getText(i18nKeys.TREE_MAP_TABLE__HEADER_RECORDS_PER_PERSON),
        maxSize: 75,
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
      },
    ],
    [setSelectedConceptId]
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      initialState={{ density: "compact" }}
      enableColumnResizing
      muiTableBodyCellProps={{
        sx: {
          fontSize: ".85em",
        },
      }}
    />
  );
};

export default TreeMapTable;
