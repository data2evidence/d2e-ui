import React, { FC, useState, useCallback, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TablePaginationActions, IconButton, FileIcon } from "@portal/components";
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination } from "@mui/material";
import { Study } from "../../../../types";
import { HistoryJob } from "../types";
import { useDialogHelper } from "../../../../hooks/useDialogHelper";
import ResultsDialog from "../../DQD/ResultsDialog/ResultsDialog";
import { useDatasets } from "../../../../hooks";
import { FlowRunJobStateTypes } from "../types";
import { useTranslation } from "../../../../contexts";
import "./JobRunsTable.scss";

const JobStatusColorMapping = {
  // Blue
  [FlowRunJobStateTypes.COMPLETED]: "#050080",
  // Orange
  [FlowRunJobStateTypes.SCHEDULED]: "#FCA130",
  [FlowRunJobStateTypes.PENDING]: "#FCA130",
  [FlowRunJobStateTypes.RUNNING]: "#FCA130",
  [FlowRunJobStateTypes.PAUSED]: "#FCA130",
  // Red
  [FlowRunJobStateTypes.CANCELLING]: "#d53939",
  [FlowRunJobStateTypes.CANCELLED]: "#d53939",
  [FlowRunJobStateTypes.FAILED]: "#d53939",
  [FlowRunJobStateTypes.CRASHED]: "#d53939",
};

const inProgressJobStates = [
  FlowRunJobStateTypes.SCHEDULED as string,
  FlowRunJobStateTypes.PENDING as string,
  FlowRunJobStateTypes.RUNNING as string,
  FlowRunJobStateTypes.PAUSED as string,
];

interface ExpandingRowProps {
  handleStudySelect: (schemaName: string, studyId: string) => void;
  handleViewDetailClick: (job: HistoryJob) => void;
  row: HistoryJob;
  datasets: Study[];
  handleCancelJobClick: (id: string) => void;
  handleViewLogsClick: (id: string) => void;
}

const ExpandingRow: FC<ExpandingRowProps> = ({
  row,
  datasets,
  handleViewDetailClick,
  handleStudySelect,
  handleCancelJobClick,
  handleViewLogsClick,
}) => {
  const { getText, i18nKeys } = useTranslation();
  const dataset = datasets.find((s) => s.id === row.datasetId);
  return (
    <>
      <TableRow key={row.schemaName + row.type + row.completedAt}>
        <TableCell sx={{ color: "#050080" }} align="left">
          {dataset?.studyDetail?.name || "-"}
        </TableCell>
        <TableCell sx={{ color: "#050080" }} align="left">
          {row.type ? row.type : "-"}
        </TableCell>
        <TableCell sx={{ color: "#050080" }} align="left">
          {row.flowRunName}
        </TableCell>
        <TableCell sx={{ color: "#050080" }} align="left">
          {row.dataCharacterizationSchema ? row.dataCharacterizationSchema : "-"}
        </TableCell>
        <TableCell sx={{ color: "#050080" }} align="left">
          {row.createdAt}
        </TableCell>
        <TableCell sx={{ color: "#050080" }} align="left">
          {row.completedAt}
        </TableCell>
        <TableCell sx={{ color: JobStatusColorMapping[row.status as keyof typeof JobStatusColorMapping] }} align="left">
          {row.status}
        </TableCell>
        <TableCell sx={{ color: "#050080" }} align="left">
          <IconButton
            startIcon={<FileIcon />}
            title={getText(i18nKeys.JOB_RUNS_TABLE__VIEW)}
            onClick={() => {
              handleViewLogsClick(row.flowRunId);
            }}
          />
        </TableCell>
        <TableCell sx={{ color: "#050080" }} align="left">
          {
            // If status is "in progress", show abort button
            inProgressJobStates.includes(row.status) ? (
              <Button
                className="cancel-job-button"
                onClick={() => handleCancelJobClick(row.flowRunId)}
                text={getText(i18nKeys.JOB_RUNS_TABLE__CANCEL)}
                variant="outlined"
              />
            ) : (
              "-"
            )
          }
        </TableCell>
        <TableCell sx={{ color: "#050080" }} align="left">
          {row.status === FlowRunJobStateTypes.COMPLETED ? (
            // If status is COMPLETED, show view detail button
            <IconButton
              startIcon={<FileIcon />}
              title={getText(i18nKeys.JOB_RUNS_TABLE__VIEW)}
              onClick={() => {
                const studyId = row.datasetId ?? (datasets.find((s) => s.schemaName === row.schemaName)?.id || "");
                handleStudySelect(row.schemaName, studyId);
                handleViewDetailClick(row);
              }}
            />
          ) : (
            getText(i18nKeys.JOB_RUNS_TABLE__NOT_AVAILABLE)
          )}
        </TableCell>
      </TableRow>
    </>
  );
};

interface JobRunsTableProps {
  handleStudySelect: (schemaName: string, studyId: string) => void;
  data: HistoryJob[];
  handleCancelJobClick: (id: string) => void;
}

const JobRunsTable: FC<JobRunsTableProps> = ({ data, handleStudySelect, handleCancelJobClick }) => {
  const { getText, i18nKeys } = useTranslation();
  const datasets = useDatasets("systemAdmin")[0];
  // Dialog show hooks
  const [showResultsDialog, openResultsDialog, closeResultsDialog] = useDialogHelper(false);
  const [selectedJob, setSelectedJob] = useState<HistoryJob | null>(null);
  const navigate = useNavigate();

  const handleViewDetailClick = (job: HistoryJob) => {
    setSelectedJob(job);
    openResultsDialog();
  };

  const handleViewLogsClick = (jobId: string) => {
    navigate(`flowrun/${jobId}`, { replace: false });
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleRowsPerPageChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value) || 25);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPage(page);
  }, []);

  if (data.length === 0) {
    return <div className="info__section">{getText(i18nKeys.JOB_RUNS_TABLE__NO_JOBS_FOUND)}</div>;
  }

  const pageData = data.slice(rowsPerPage * page, rowsPerPage * (page + 1));

  return (
    <>
      <TableContainer className="history__list">
        <Table sx={{ minWidth: 700 }} aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell align="left" colSpan={1}>
                {getText(i18nKeys.JOB_RUNS_TABLE__DATASETS)}
              </TableCell>
              <TableCell align="left" colSpan={1}>
                {getText(i18nKeys.JOB_RUNS_TABLE__TAG)}
              </TableCell>
              <TableCell align="left" colSpan={1}>
                {getText(i18nKeys.JOB_RUNS_TABLE__NAME)}
              </TableCell>
              <TableCell align="left" colSpan={1}>
                {getText(i18nKeys.JOB_RUNS_TABLE__DATA_CHARACTERIZATION_SCHEMA)}
              </TableCell>
              <TableCell align="left" colSpan={1}>
                {getText(i18nKeys.JOB_RUNS_TABLE__CREATED_TIME)}
              </TableCell>
              <TableCell align="left" colSpan={1}>
                {getText(i18nKeys.JOB_RUNS_TABLE__COMPLETED_TIME)}
              </TableCell>
              <TableCell align="left" colSpan={1}>
                {getText(i18nKeys.JOB_RUNS_TABLE__STATE)}
              </TableCell>
              <TableCell align="left" colSpan={1}>
                {getText(i18nKeys.JOB_RUNS_TABLE__LOGS)}
              </TableCell>
              <TableCell align="left" colSpan={1}>
                {getText(i18nKeys.JOB_RUNS_TABLE__ACTION)}
              </TableCell>
              <TableCell align="left" colSpan={1}>
                {getText(i18nKeys.JOB_RUNS_TABLE__RESULTS)}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageData.map((row) => (
              <ExpandingRow
                key={row.flowRunId}
                row={row}
                datasets={datasets}
                handleStudySelect={handleStudySelect}
                handleViewDetailClick={handleViewDetailClick}
                handleCancelJobClick={handleCancelJobClick}
                handleViewLogsClick={handleViewLogsClick}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data.length > 0 && (
        <TablePagination
          component="div"
          count={data.length}
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

      {selectedJob !== null && (
        <ResultsDialog job={selectedJob} open={showResultsDialog} onClose={closeResultsDialog} />
      )}
    </>
  );
};

export default JobRunsTable;
