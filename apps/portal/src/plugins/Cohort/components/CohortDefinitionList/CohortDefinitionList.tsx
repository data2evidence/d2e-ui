import React, { FC, useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { Button, IconButton, Loader, TableCell, TableRow, TablePaginationActions, TrashIcon } from "@portal/components";
import { useFeedback } from "../../../../contexts";
import { CohortMapping } from "../../../../types";
import { CohortMgmt } from "../../../../axios/cohort-mgmt";
import "./CohortDefinitionList.scss";

interface CohortDefinitionListProps {
  userId?: string;
  cohortMgmtClient: CohortMgmt;
  setActiveCohort: React.Dispatch<React.SetStateAction<CohortMapping | undefined>>;
  openDeleteCohortDialog: () => void;
  openDataQualityDialog: () => void;
  refetch: boolean;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

dayjs.extend(customParseFormat);

const CohortDefinitionList: FC<CohortDefinitionListProps> = ({
  userId,
  cohortMgmtClient,
  setActiveCohort,
  openDeleteCohortDialog,
  openDataQualityDialog,
  refetch,
  setRefetch,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [cohortDefinitionCount, setCohortDefinitionCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowPerPage] = useState(10);
  const { setFeedback } = useFeedback();

  useEffect(() => {
    // Fetch all cohorts
    setIsLoading(true);
    const fetchData = async () => {
      if (userId) {
        try {
          // Get all cohorts based on pagination
          const result = await cohortMgmtClient.getCohorts(page * rowsPerPage, rowsPerPage);
          setData(result.data);
          setCohortDefinitionCount(result.cohortDefinitionCount);
        } catch (err) {
          console.error(err);
          setFeedback({
            type: "error",
            message: "An error has occurred.",
            description: "Please try again. To report the error, please send an email to help@data4life.care.",
          });
        } finally {
          setIsLoading(false);
          setRefetch(false);
        }
      }
    };
    fetchData();
  }, [userId, cohortMgmtClient, refetch, setRefetch, setFeedback, page, rowsPerPage]);

  const handleChangePage = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPage(page);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowPerPage(Number(event.target.value) || 10);
  }, []);

  const handleDeleteCohort = useCallback(
    (cohort: CohortMapping) => {
      setActiveCohort(cohort);
      openDeleteCohortDialog();
    },
    [openDeleteCohortDialog, setActiveCohort]
  );

  const handleDataQualityButtonPress = useCallback(
    (cohort: CohortMapping) => {
      setActiveCohort(cohort);
      openDataQualityDialog();
    },
    [openDataQualityDialog, setActiveCohort]
  );

  if (isLoading) return <Loader />;

  const isEmpty = !data || data.length === 0;
  return (
    <>
      <div className="cohort__list">
        <div className="cohort__list-header"></div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Patient Count</TableCell>
                <TableCell>Creation Timestamp</TableCell>
                <TableCell>Modification Timestamp</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Jobs</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(isLoading || isEmpty) && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {!isLoading && isEmpty && "No data available"}
                    {isLoading && <Loader />}
                  </TableCell>
                </TableRow>
              )}
              {data.length > 0 &&
                data.map((cohort, index) => (
                  <TableRow key={cohort.id} style={index % 2 ? { background: "#edf2f7" } : { background: "white" }}>
                    <TableCell>{cohort.id}</TableCell>
                    <TableCell>{cohort.name}</TableCell>
                    <TableCell>{cohort.description}</TableCell>
                    <TableCell>{cohort.patientIds.length}</TableCell>
                    <TableCell>
                      {cohort.creationTimestamp && dayjs(cohort.creationTimestamp).format("DD/MM/YYYY, h:mm A")}
                    </TableCell>
                    <TableCell>
                      {cohort.modificationTimestamp && cohort.modificationTimestamp !== "NoValue"
                        ? dayjs(cohort.modificationTimestamp).format("DD/MM/YYYY, h:mm A")
                        : "-"}
                    </TableCell>
                    <TableCell>{cohort.owner}</TableCell>
                    <TableCell className="col-action">
                      <Button onClick={() => handleDataQualityButtonPress(cohort)} text="Data Quality"></Button>
                    </TableCell>
                    <TableCell className="col-action">
                      <div className="table-button-container">
                        <IconButton
                          startIcon={<TrashIcon />}
                          title="Delete"
                          disabled={cohort.owner !== userId}
                          onClick={() => handleDeleteCohort(cohort)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={cohortDefinitionCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </div>
    </>
  );
};

export default CohortDefinitionList;
