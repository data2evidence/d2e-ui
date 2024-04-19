import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table";
import { TablePaginationActions, AddIcon, RemoveIcon } from "@portal/components";
import { useFeedback } from "../../../../../contexts";
import { FilterOptions, TabName, FhirValueSetExpansionContainsWithExt, TerminologyResult } from "../../utils/types";
import { Terminology } from "../../../../../axios/terminology";
import { tabNames } from "../../utils/constants";
import SearchBar from "../SearchBar/SearchBar";
import "./TerminologyList.scss";

interface TerminologyListProps {
  userId?: string;
  onConceptClick: (conceptId: number | null) => void;
  selectedConceptId: number | null;
  onSelectConceptId?: (conceptData: FhirValueSetExpansionContainsWithExt) => void;
  initialInput: string;
  isConceptSet?: boolean;
  selectedConcepts: FhirValueSetExpansionContainsWithExt[];
  tab: TabName;
  toggleDescendantsAndMapped?: (conceptId: number, type: "DESCENDANTS" | "MAPPED") => void;
  showAddIcon: boolean;
  conceptsResult: TerminologyResult | null;
  setConceptsResult: React.Dispatch<React.SetStateAction<TerminologyResult | null>>;
  datasetId?: string;
  isDrawer: boolean;
}

const mapFilterOptions = (options: { [key: string]: number }): { text: string; value: string }[] => {
  const optionsWithCount: string[] = Object.keys(options)
    .filter((key) => options[key])
    .sort();
  const optionsWithNoCount: string[] = Object.keys(options)
    .filter((key) => !options[key])
    .sort();
  const optionNames = [...optionsWithCount, ...optionsWithNoCount];
  return optionNames.map((optionName) => {
    return {
      text: `${optionName} (${options[optionName]})`,
      value: optionName,
    };
  });
};

const TerminologyList: FC<TerminologyListProps> = ({
  userId,
  onConceptClick,
  selectedConceptId,
  onSelectConceptId,
  initialInput,
  isConceptSet = false,
  selectedConcepts,
  tab,
  toggleDescendantsAndMapped,
  showAddIcon,
  conceptsResult,
  setConceptsResult,
  datasetId,
  isDrawer,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [terminologiesCount, setTerminologiesCount] = useState(0);
  const [searchText, setSearchText] = useState(initialInput);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    conceptClassId: {},
    domainId: {},
    standardConcept: {},
    vocabularyId: {},
    concept: {},
    validity: {},
  });
  const [allFilterOptions, setAllFilterOptions] = useState<FilterOptions>({
    conceptClassId: {},
    domainId: {},
    standardConcept: {},
    vocabularyId: {},
    concept: {},
    validity: {},
  });
  const [allFilterOptionsZeroed, setAllFilterOptionsZeroed] = useState<FilterOptions>({
    conceptClassId: {},
    domainId: {},
    standardConcept: {},
    vocabularyId: {},
    concept: {},
    validity: {},
  });
  const [columnFilters, setColumnFilters] = useState<{ id: string; value: unknown }[]>([]);
  const { setFeedback } = useFeedback();
  const tableRef = useRef<HTMLTableElement>(null);

  const updateSearchResult = useCallback(
    (keyword: string) => {
      setSearchText(keyword);
      setPage(0);
    },
    [searchText]
  );

  const fetchData = useCallback(async () => {
    if (userId && datasetId) {
      try {
        setIsLoading(true);
        const terminologyAPI = new Terminology();
        const conceptClassIdFilters = (columnFilters.find((filter) => filter.id === "conceptClassId")?.value ||
          []) as string[];
        const domainIdFilters = (columnFilters.find((filter) => filter.id === "domainId")?.value || []) as string[];
        const vocabularyIdFilters = (columnFilters.find((filter) => filter.id === "vocabularyId")?.value ||
          []) as string[];
        const conceptFilters = (columnFilters.find((filter) => filter.id === "concept")?.value || []) as string[];
        const standardConceptFilters = conceptFilters.map((concept) => (concept === "Standard" ? "S" : "Non-standard"));
        const validityFilters = (columnFilters.find((filter) => filter.id === "validity")?.value || []) as string[];
        if (
          tab === "SEARCH" &&
          Array.isArray(conceptClassIdFilters) &&
          Array.isArray(domainIdFilters) &&
          Array.isArray(vocabularyIdFilters) &&
          Array.isArray(standardConceptFilters)
        ) {
          const filterOptions = await terminologyAPI.getFilterOptions(
            datasetId,
            searchText,
            conceptClassIdFilters,
            domainIdFilters,
            vocabularyIdFilters,
            standardConceptFilters
          );
          const combinedFilterOptions: FilterOptions = {
            conceptClassId: { ...allFilterOptionsZeroed.conceptClassId, ...filterOptions.conceptClassId },
            domainId: { ...allFilterOptionsZeroed.domainId, ...filterOptions.domainId },
            vocabularyId: { ...allFilterOptionsZeroed.vocabularyId, ...filterOptions.vocabularyId },
            standardConcept: { ...allFilterOptionsZeroed.standardConcept, ...filterOptions.standardConcept },
            concept: { ...allFilterOptionsZeroed.concept, ...filterOptions.concept },
            validity: { ...allFilterOptionsZeroed.validity, ...filterOptions.validity },
          };
          setFilterOptions(combinedFilterOptions);
          const fhirResponse = await terminologyAPI.getTerminologies(
            page,
            rowsPerPage,
            datasetId,
            searchText,
            conceptClassIdFilters,
            domainIdFilters,
            vocabularyIdFilters,
            standardConceptFilters,
            validityFilters
          );
          const response = {
            count: fhirResponse.expansion.total,
            data: fhirResponse.expansion.contains,
          };
          response.data.map((data: any) => {
            data["conceptCode"] = data["code"] as string;
            data["conceptName"] = data["display"] as string;
            data["vocabularyId"] = data["system"] as string;
          });
          setConceptsResult(response);
        } else {
          const response = await terminologyAPI.getRecommendedConcepts(
            selectedConcepts.map((selectedConcept) => selectedConcept.conceptId),
            datasetId
          );
          setConceptsResult({ count: response.length, data: response });
        }
      } catch (e) {
        console.error(e);
        setFeedback({
          type: "error",
          message: "An error has occurred",
          description: "Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [
    searchText,
    page,
    rowsPerPage,
    setFeedback,
    userId,
    tab,
    datasetId,
    selectedConcepts,
    JSON.stringify(columnFilters),
    allFilterOptionsZeroed,
  ]);

  const onClickAddRemoveButton = useCallback(
    (terminology: FhirValueSetExpansionContainsWithExt) => {
      onSelectConceptId?.(terminology);
    },
    [onSelectConceptId]
  );

  useEffect(() => {
    if (tab === tabNames.SELECTED) {
      return;
    }
    setPage(0);
    fetchData();
  }, [setFeedback, userId, searchText, tab, JSON.stringify(columnFilters)]);

  useEffect(() => {
    if (conceptsResult) setTerminologiesCount(conceptsResult.count);
    else setTerminologiesCount(0);
  }, [conceptsResult]);

  useEffect(() => {
    if (tab === "SEARCH") {
      fetchData();
      return;
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (tab === tabNames.SELECTED) {
      if (selectedConcepts.length) {
        setTerminologiesCount(selectedConcepts.length);
        setPage(0);
      } else {
        setTerminologiesCount(0);
        return;
      }
    }
    // Scroll table to top when changing tabs on page 0
    tableRef?.current?.scrollIntoView();
  }, [tab]);

  useEffect(() => {
    const getAllFilterOptions = async () => {
      if (!datasetId) {
        return;
      }
      const terminologyAPI = new Terminology();
      const filterOptions = await terminologyAPI.getFilterOptions(datasetId, searchText, [], [], [], []);
      const filterOptionsZeroed = JSON.parse(JSON.stringify(filterOptions));
      for (const filterKey of ["conceptClassId", "domainId", "vocabularyId", "standardConcept", "concept"] as const) {
        for (const optionKey in filterOptionsZeroed[filterKey]) {
          filterOptionsZeroed[filterKey][optionKey] = 0;
        }
      }
      setAllFilterOptions(filterOptions);
      setAllFilterOptionsZeroed(filterOptionsZeroed);
    };
    getAllFilterOptions();
  }, [datasetId]);

  const handleChangePage = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPage(page);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value) || 25);
    setPage(0);
  }, []);

  const fullListData = tab === tabNames.SELECTED ? selectedConcepts : conceptsResult?.data || [];
  const listData =
    tab === tabNames.SELECTED || tab === tabNames.RELATED
      ? fullListData.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
      : fullListData;

  useEffect(() => {
    // Only applies to selected tab as it is the only one that can remove items
    if (tab === tabNames.SELECTED) {
      setTerminologiesCount(selectedConcepts.length);
      if (!listData.length && page !== 0) {
        setPage(0);
      }
    }
  }, [JSON.stringify(listData)]);

  const { columns, columnOrder } = useMemo<{
    columns: MRT_ColumnDef<FhirValueSetExpansionContainsWithExt>[];
    columnOrder: string[];
  }>(() => {
    const basicColumnOrder = [
      "conceptId",
      "conceptCode",
      "conceptName",
      "conceptClassId",
      "concept",
      "domainId",
      "vocabularyId",
      "validity",
    ];
    const basicColumns: MRT_ColumnDef<FhirValueSetExpansionContainsWithExt>[] = [
      {
        accessorKey: "conceptId",
        header: "ID",
        grow: true,
        size: 100,
      },
      {
        accessorKey: "code",
        header: "Code",
        grow: true,
        size: 180,
      },
      {
        accessorKey: "display",
        header: "Name",
        grow: true,
        size: isDrawer ? 250 : 350,
      },
      {
        accessorKey: "conceptClassId",
        header: "Class",
        filterVariant: "multi-select",
        filterSelectOptions: filterOptions?.conceptClassId ? mapFilterOptions(filterOptions.conceptClassId) : [],
        enableColumnFilter: tab === tabNames.SEARCH,
        grow: true,
        size: 180,
      },
      {
        accessorKey: "concept",
        header: "Concept",
        filterVariant: "multi-select",
        filterSelectOptions: filterOptions?.concept ? mapFilterOptions(filterOptions.concept) : [],
        enableColumnFilter: tab === tabNames.SEARCH,
        grow: true,
        size: 180,
      },
      {
        accessorKey: "domainId",
        header: "Domain",
        filterVariant: "multi-select",
        filterSelectOptions: filterOptions?.domainId ? mapFilterOptions(filterOptions.domainId) : [],
        enableColumnFilter: tab === tabNames.SEARCH,
        grow: true,
        size: 180,
      },
      {
        accessorKey: "system",
        header: "Vocabulary",
        filterVariant: "multi-select",
        filterSelectOptions: filterOptions?.vocabularyId ? mapFilterOptions(filterOptions.vocabularyId) : [],
        enableColumnFilter: tab === tabNames.SEARCH,
        grow: true,
        size: 180,
      },
      {
        accessorKey: "validity",
        header: "Validity",
        filterVariant: "multi-select",
        filterSelectOptions: filterOptions?.validity ? mapFilterOptions(filterOptions.validity) : [],
        enableColumnFilter: tab === tabNames.SEARCH,
        grow: true,
        size: 180,
      },
    ];

    const addButton: MRT_ColumnDef<FhirValueSetExpansionContainsWithExt>[] = [
      {
        accessorKey: "",
        header: "",
        id: "addButton",
        Cell: ({ row }: { row: any }) => {
          const terminology = row.original as FhirValueSetExpansionContainsWithExt;
          const isSelected = selectedConcepts.find((concept) => concept.conceptId === terminology.conceptId);
          return (
            <div
              style={{ display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}
              onClick={() => onClickAddRemoveButton(terminology)}
            >
              {isSelected ? <RemoveIcon /> : <AddIcon />}
            </div>
          );
        },
        grow: false,
        size: 30,
      },
    ];
    if (tab === "SELECTED") {
      const descendantsAndMapped: MRT_ColumnDef<FhirValueSetExpansionContainsWithExt>[] = [
        {
          accessorKey: "useDescendants",
          header: "Descendants",
          Cell: ({ row }: { row: any }) => {
            const terminology = row.original as FhirValueSetExpansionContainsWithExt;
            return (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Checkbox
                  checked={!!terminology.useDescendants}
                  onClick={() => toggleDescendantsAndMapped?.(terminology.conceptId, "DESCENDANTS")}
                  sx={{ padding: 0 }}
                />
              </div>
            );
          },
          grow: false,
          size: 120,
          muiTableBodyCellProps: {
            sx: { justifyContent: "center" },
          },
        },
        {
          accessorKey: "useMapped",
          header: "Mapped",
          Cell: ({ row }: { row: any }) => {
            const terminology = row.original as FhirValueSetExpansionContainsWithExt;
            return (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Checkbox
                  checked={terminology?.useMapped}
                  onClick={() => toggleDescendantsAndMapped?.(terminology.conceptId, "MAPPED")}
                  sx={{ padding: 0 }}
                />
              </div>
            );
          },
          grow: false,
          size: 80,
          muiTableBodyCellProps: {
            sx: { justifyContent: "center" },
          },
        },
      ];
      return {
        columns: [...addButton, ...descendantsAndMapped, ...basicColumns],
        columnOrder: ["addButton", "useDescendants", "useMapped", ...basicColumnOrder],
      };
    }
    if (showAddIcon && onSelectConceptId) {
      return { columns: [...addButton, ...basicColumns], columnOrder: ["addButton", ...basicColumnOrder] };
    }
    return { columns: basicColumns, columnOrder: basicColumnOrder };
  }, [filterOptions, tab, JSON.stringify(listData), selectedConcepts]);

  const table = useMaterialReactTable({
    layoutMode: "grid",
    columns,
    data: listData,
    initialState: { density: "compact", showColumnFilters: true },
    defaultColumn: {
      enableGlobalFilter: false,
      enableHiding: false,
      enableSorting: false,
      enableColumnFilter: false,
      enableColumnActions: false,
    },
    onColumnFiltersChange: setColumnFilters,
    state: { columnFilters, columnOrder },
    enablePagination: false, // Use TablePagination instead of built in
    muiTableBodyRowProps: ({ row, staticRowIndex }) => ({
      onClick: () => {
        if (isConceptSet) {
          return;
        }
        const terminology = row.original;
        onConceptClick(terminology.conceptId);
      },
      sx: {
        cursor: "pointer", //you might want to change the cursor too when adding an onClick
        "&.MuiTableRow-root": {
          backgroundColor:
            selectedConceptId === row.original.conceptId
              ? "#ccdef1 !important"
              : staticRowIndex % 2
              ? "#edf2f7  !important"
              : "transparent !important",
          cursor: selectedConceptId === row.original.conceptId || isConceptSet ? "auto" : "pointer",
        },
        "&.MuiTableRow-root:hover": {
          backgroundColor: "#ccdef1 !important",
        },
      },
    }),
    muiTableBodyCellProps: {
      sx: {
        whiteSpace: "normal",
        wordWrap: "break-word",
        color: "#000080",
        padding: "6px",
      },
    },
    muiTableContainerProps: {
      sx: { overflowY: "auto", border: "1px solid #d4d4d4", height: "100%" },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#edf2f7",
        padding: "6px",
        "& .MuiSelect-select": {
          fontSize: 12,
          paddingRight: "0px !important",
          "& .MuiChip-label": {
            fontSize: 10,
          },
        },
      },
    },
    enableTopToolbar: false,
  });
  return (
    <>
      {tab === "SEARCH" ? <SearchBar keyword={searchText} onEnter={updateSearchResult} /> : null}
      <MaterialReactTable table={table} />
      {terminologiesCount ? (
        <TablePagination
          component="div"
          count={terminologiesCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onConceptClick(null);
            handleChangeRowsPerPage(event);
          }}
          onPageChange={(event, page) => {
            onConceptClick(null);
            handleChangePage(event, page);
          }}
          ActionsComponent={TablePaginationActions}
          sx={{ overflow: "visible", height: "52px", "& .MuiButtonBase-root:not(.Mui-disabled)": { color: "#000080" } }}
        />
      ) : null}
    </>
  );
};

export default TerminologyList;
