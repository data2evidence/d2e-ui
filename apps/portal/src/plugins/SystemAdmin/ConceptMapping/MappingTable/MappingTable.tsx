import React, { FC, useCallback, useContext, useMemo, useState } from "react";
import { MaterialReactTable, MRT_ColumnDef, MRT_RowData, useMaterialReactTable } from "material-react-table";
import { ConceptMappingContext, ConceptMappingDispatchContext } from "../Context/ConceptMappingContext";
import "./MappingTable.scss";
import { useTranslation } from "../../../../contexts";
import { Box, Button } from "@portal/components";
import { Terminology } from "../../../../axios/terminology";
import { RowObject } from "../types";

interface MappingTableProps {
  selectedDatasetId: string;
}

const MappingTable: FC<MappingTableProps> = ({ selectedDatasetId }) => {
  const { getText, i18nKeys } = useTranslation();
  const conceptMappingState = useContext(ConceptMappingContext);
  const dispatch: React.Dispatch<any> = useContext(ConceptMappingDispatchContext);
  const { sourceCode, sourceName, sourceFrequency, description, domainId } = conceptMappingState.columnMapping;
  const csvData = conceptMappingState.csvData.data;
  const [isLoading, setIsLoading] = useState(false);

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
        backgroundColor: "#fafafa",
        "&.MuiTableRow-root:hover": {
          backgroundColor: "#ebf1f8",
          boxShadow: "inset 0px 0px 0px 2px #3b438c",
        },
      },
      backgroundColor: row.index % 2 === 0 ? "#f5f5f5" : "#ffffff",
      boxShadow: row.original == conceptMappingState.selectedData ? "inset 0px 0px 0px 2px #3b438c" : "none",
    },
  });

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
    muiTopToolbarProps: {
      style: {
        backgroundColor: "#fbfbfd",
      },
    },
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
        <Button
          onClick={() => populateConcepts()}
          text={getText(i18nKeys.MAPPING_TABLE__POPULATE_CONCEPTS)}
          loading={isLoading}
          disabled={getAvailableRows().length === 0}
        />
      </Box>
    ),
  });

  const getAvailableRows = useCallback(() => {
    return tableInstance.getCenterRows().filter((row) => row.original.status !== "checked");
  }, []);

  const populateConcepts = useCallback(async () => {
    const formattedRows = getAvailableRows().map((row) => {
      const formattedRow: RowObject = { index: row.index, searchText: row.original[sourceName] };
      if (domainId) {
        formattedRow["domainId"] = row.original[domainId];
      }
      return formattedRow;
    });

    setIsLoading(true);
    const api = new Terminology();
    const result = await api.getFirstConcepts(formattedRows, selectedDatasetId);

    dispatch({ type: "UPDATE_MULTIPLE_ROWS", data: result });
    setIsLoading(false);
  }, []);

  return <MaterialReactTable table={tableInstance} />;
};

export default MappingTable;
