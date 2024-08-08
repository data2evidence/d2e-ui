import React, { FC, useCallback, useContext, useMemo } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_RowData,
  MRT_TableInstance,
  useMaterialReactTable,
} from "material-react-table";
import { ConceptMappingContext, ConceptMappingDispatchContext } from "../Context/ConceptMappingContext";
import "./MappingTable.scss";
import { useTranslation } from "../../../../contexts";
import { Box, Button } from "@portal/components";

const MappingTable: FC = () => {
  const { getText, i18nKeys } = useTranslation();
  const conceptMappingState = useContext(ConceptMappingContext);
  const dispatch: React.Dispatch<any> = useContext(ConceptMappingDispatchContext);
  const { sourceCode, sourceName, sourceFrequency, description, domainId } = conceptMappingState.columnMapping;
  const csvData = conceptMappingState.csvData.data;

  const columns = useMemo<MRT_ColumnDef<MRT_RowData, any>[]>(
    () => [
      {
        id: "0",
        accessorKey: "status",
        header: getText(i18nKeys.MAPPING_TABLE__STATUS),
        size: 150,
      },
      {
        id: "1",
        accessorKey: sourceCode,
        header: getText(i18nKeys.MAPPING_TABLE__SOURCE),
        size: 150,
      },
      {
        id: "2",
        accessorKey: sourceName,
        header: getText(i18nKeys.MAPPING_TABLE__NAME), // source name
        size: 150,
      },
      {
        id: "3",
        accessorKey: sourceFrequency,
        header: getText(i18nKeys.MAPPING_TABLE__FREQUENCY),
        size: 150,
      },
      {
        id: "4",
        accessorKey: description,
        header: getText(i18nKeys.MAPPING_TABLE__DESCRIPTION),
        size: 150,
      },
      {
        id: "5",
        accessorKey: "conceptId",
        header: getText(i18nKeys.MAPPING_TABLE__CONCEPT_ID),
        size: 150,
      },
      {
        id: "6",
        accessorKey: "conceptName",
        header: getText(i18nKeys.MAPPING_TABLE__CONCEPT_NAME),
        size: 150,
      },
      {
        id: "7",
        accessorKey: "domainId",
        header: getText(i18nKeys.MAPPING_TABLE__DOMAIN_ID),
        size: 150,
      },
    ],
    [sourceCode, sourceName, sourceFrequency, description, getText]
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

  const populateConcepts = useCallback((table: MRT_TableInstance<MRT_RowData>) => {
    let formattedRows;
    const currentRows = table.getCenterRows();
    // row[domainId] => user selected domain value
    if (domainId) {
      formattedRows = currentRows.map((row) => {
        return { row: row.original, searchText: row.original[sourceName], domainId: row.original[domainId] };
      });
    } else {
      formattedRows = currentRows.map((row) => {
        return { row: row.original, searchText: row.original[sourceName] };
      });
    }

    // call api with new rows
    // to receive list of concepts. requires conceptId, conceptName, domainId, and also given row data.

    // loop through list.
    // set active data row
    // dispatch({ type: "ADD_SELECTED_DATA", data: row.original });

    // update data row. this is dependant on above active row
    // dispatch({
    //   type: "UPDATE_CSV_DATA",
    //   data: {
    //     conceptId: conceptData.conceptId,
    //     conceptName: conceptData.conceptName,
    //     domainId: conceptData.domainId,
    //   },
    // });
    // dispatch({ type: "CLEAR_SELECTED_DATA" });
  }, []);

  const tableInstance = useMaterialReactTable({
    columns,
    data: csvData,
    enableColumnResizing: true,
    muiTableHeadCellProps: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
      },
    },
    muiTableBodyCellProps: {
      style: {
        fontSize: "14px",
        color: "#000080",
      },
    },
    muiTableBodyRowProps: TableBodyRowProps,
    muiTableHeadRowProps: {
      style: {
        backgroundColor: "#ebf1f8",
      },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
        <Button onClick={() => console.log(populateConcepts(table))} text="Populate all"></Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={tableInstance} />;
};

export default MappingTable;
