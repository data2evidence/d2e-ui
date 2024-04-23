import React, { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { Tabs, Tab } from "@mui/material";
import {
  Button,
  EditIcon,
  FormControl,
  IconButton,
  Loader,
  MenuItem,
  SelectChangeEvent,
  TableCell,
  TablePaginationActions,
  TableRow,
  Title,
} from "@portal/components";
import { api } from "../../../axios/api";
import { useFeedback } from "../../../contexts";
import { useUserInfo } from "../../../contexts/UserContext";
import Terminology from "../../Researcher/Terminology/Terminology";
import { ConceptSetWithConceptDetails } from "../../Researcher/Terminology/utils/types";
import { TerminologyProps } from "../../Researcher/Terminology/Terminology";
import SearchBar from "../../../components/SearchBar/SearchBar";
import { PageProps, ResearcherStudyMetadata } from "@portal/plugin";
import "./ConceptSets.scss";

enum ConceptSetTab {
  ConceptSearch = "ConceptSearch",
  ConceptSets = "ConceptSets",
}

interface ConceptSetsProps extends PageProps<ResearcherStudyMetadata> {}

export const ConceptSets: FC<ConceptSetsProps> = ({ metadata }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const { setFeedback } = useFeedback();
  const [data, setData] = useState<ConceptSetWithConceptDetails[]>([]);
  const [tabValue, setTabValue] = useState(ConceptSetTab.ConceptSearch);
  const userId = useUserInfo().user?.userId;
  const datasetId = metadata?.studyId;

  const handleTabSelectionChange = async (event: React.SyntheticEvent, value: ConceptSetTab) => {
    setTabValue(value);
  };

  const updateSearchResult = useCallback(
    (keyword: string) => {
      if (keyword === searchText) {
        return;
      }
      setSearchText(keyword);
      setPage(0);
    },
    [searchText]
  );

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await api.terminology.getConceptSets();
      setData(response);
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddAndEditConceptSet = useCallback(
    (conceptSetId?: string) => {
      if (datasetId) {
        return;
      }
      const event = new CustomEvent<{ props: TerminologyProps }>("alp-terminology-open", {
        detail: {
          props: {
            selectedConceptSetId: conceptSetId,
            onClose: () => {
              fetchData();
            },
            mode: "CONCEPT_SET",
            isConceptSet: true,
            selectedDatasetId: datasetId,
          },
        },
      });
      window.dispatchEvent(event);
    },
    [fetchData, datasetId]
  );

  const handleRowsPerPageChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value) || 25);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPage(page);
  }, []);

  const filteredData = data.filter((row) => row.name.toLowerCase().includes(searchText));
  const pageData = filteredData.slice(rowsPerPage * page, rowsPerPage * (page + 1));

  if (isLoading || datasetId) return <Loader />;

  if (!userId) {
    return null;
  }

  return (
    <>
      <div className="concept-sets">
        <div className="concept-sets__content">
          <div className="concept-sets__tabs">
            <Tabs value={tabValue} onChange={handleTabSelectionChange}>
              <Tab disableRipple label="Concept Search" value={ConceptSetTab.ConceptSearch}></Tab>
              <Tab disableRipple label="Concept Sets" value={ConceptSetTab.ConceptSets}></Tab>
            </Tabs>
          </div>

          {tabValue == ConceptSetTab.ConceptSearch && <Terminology baseUserId={userId} />}

          {tabValue == ConceptSetTab.ConceptSets && (
            <>
              <div className="concept-sets__header">
                <div className="concept-sets__search">
                  <SearchBar keyword={searchText} onEnter={updateSearchResult} />
                </div>
                <Button text="Add concept set" onClick={() => handleAddAndEditConceptSet()} />
              </div>
              {}
              <TableContainer className="concept-sets__table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Updated</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pageData.map((row) => {
                      return (
                        <TableRow key={row.id}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.createdDate}</TableCell>
                          <TableCell>{row.modifiedDate}</TableCell>
                          <TableCell>{row.createdBy}</TableCell>
                          <TableCell>
                            <IconButton startIcon={<EditIcon />} onClick={() => handleAddAndEditConceptSet(row.id)} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {filteredData.length > 0 && (
                <TablePagination
                  component="div"
                  count={filteredData.length}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  onPageChange={handlePageChange}
                  ActionsComponent={TablePaginationActions}
                  sx={{
                    overflow: "visible",
                    height: "52px",
                    "& .MuiButtonBase-root:not(.Mui-disabled)": { color: "#000080" },
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
