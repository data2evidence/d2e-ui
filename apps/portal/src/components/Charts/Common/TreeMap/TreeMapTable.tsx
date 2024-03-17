import React, { FC, useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";

import "./TreeMapTable.scss";

interface TreeMapTableProps {
  data: any;
  setSelectedConceptId: (value: string) => void;
}
const TreeMapTable: FC<TreeMapTableProps> = ({ data, setSelectedConceptId }) => {
  // column properties
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "CONCEPT_ID",
        header: "Concept Id",
        maxSize: 75,
        Cell: ({ cell }) => (
          <div className="concept_id_text" onClick={() => setSelectedConceptId(cell.getValue<string>())}>
            {cell.getValue<string>()}
          </div>
        ),
      },
      {
        accessorKey: "CONCEPT_PATH",
        header: "Name",
      },
      {
        accessorKey: "NUM_PERSONS",
        header: "Person Count",
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
        header: "Prevalence",
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
        header: "Length of era",
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
