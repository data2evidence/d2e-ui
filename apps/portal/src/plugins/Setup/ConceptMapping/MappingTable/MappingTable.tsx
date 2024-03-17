import React, { FC, useContext, useMemo } from "react";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { ConceptMappingContext, ConceptMappingDispatchContext } from "../Context/ConceptMappingContext";
import "./MappingTable.scss";

const MappingTable: FC = () => {
  const conceptMappingState = useContext(ConceptMappingContext);
  const dispatch: React.Dispatch<any> = useContext(ConceptMappingDispatchContext);
  const { sourceCode, sourceName, sourceFrequency, description } = conceptMappingState.columnMapping;
  const csvData = conceptMappingState.csvData.data;
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        id: "0",
        accessorKey: "status",
        header: "Status",
        size: 150,
      },
      {
        id: "1",
        accessorKey: sourceCode,
        header: "Source",
        size: 150,
      },
      {
        id: "2",
        accessorKey: sourceName,
        header: "Name", // source name
        size: 150,
      },
      {
        id: "3",
        accessorKey: sourceFrequency,
        header: "Frequency",
        size: 150,
      },
      {
        id: "4",
        accessorKey: description,
        header: "Description",
        size: 150,
      },
      {
        id: "5",
        accessorKey: "conceptId",
        header: "Concept ID",
        size: 150,
      },
      {
        id: "6",
        accessorKey: "conceptName",
        header: "Concept Name",
        size: 150,
      },
      {
        id: "7",
        accessorKey: "domainId",
        header: "Domain",
        size: 150,
      },
    ],
    [sourceCode, sourceName, sourceFrequency, description]
  );

  const TableBodyRowProps = ({ row }: { row: any }) => ({
    onClick: () => {
      dispatch({ type: "ADD_SELECTED_DATA", data: row.original });
    },
    sx: {
      cursor: "pointer",
      "&:nth-of-type(even)": {
        backgroundColor: "#f8f8f8",
        "&.MuiTableRow-root:hover": {
          backgroundColor: "#ebf1f8",
          boxShadow: "inset 0px 0px 0px 2px #3b438c",
        },
      },
      backgroundColor: row.original == conceptMappingState.selectedData ? "#ebf1f8" : "transparent",
      boxShadow: row.original == conceptMappingState.selectedData ? "inset 0px 0px 0px 2px #3b438c" : "none",
    },
  });
  return (
    <MaterialReactTable
      columns={columns}
      data={csvData}
      enableColumnResizing={true}
      muiTableHeadCellProps={{
        style: {
          fontWeight: "bold",
          fontSize: "16px",
        },
      }}
      muiTableBodyCellProps={{
        style: {
          fontSize: "14px",
          color: "#000080",
        },
      }}
      muiTableBodyRowProps={TableBodyRowProps}
      muiTableHeadRowProps={{
        style: {
          backgroundColor: "#ebf1f8",
        },
      }}
    />
  );
};

export default MappingTable;
