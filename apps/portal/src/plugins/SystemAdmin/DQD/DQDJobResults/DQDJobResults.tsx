import React, { FC, useState, useEffect } from "react";

import { useDatasetLatestFlowRun, useDataQualityOverviewFromId, useDataQualityResultsFromId } from "../../../../hooks";
import { Loader } from "@portal/components";
import OverviewTable from "../../../../components/DQD/Overview/OverviewTable/OverviewTable";
import DQDTable from "../../../../components/DQD/DQDTable/DQDTable";
import { FlowRunJobStateTypes, DQD_TABLE_TYPES } from "../types";
import DownloadDataButtons from "../DownloadDataButtons/DownloadDataButtons";
import DataCharacterizationReports from "../../../../components/DQD/DataCharacterizationReports/DataCharacterizationReports";
const inProgressJobStates = [
  FlowRunJobStateTypes.SCHEDULED,
  FlowRunJobStateTypes.PENDING,
  FlowRunJobStateTypes.RUNNING,
  FlowRunJobStateTypes.PAUSED,
];

const cancelledJobStates = [FlowRunJobStateTypes.CANCELLING, FlowRunJobStateTypes.CANCELLED];

const failedJobStates = [FlowRunJobStateTypes.FAILED, FlowRunJobStateTypes.CRASHED];

interface DQDJobResultsProps {
  datasetId: string;
  datasetName: string;
  tableType: string;
  activeReleaseId?: string;
}

export const DQDJobResults: FC<DQDJobResultsProps> = ({ datasetId, datasetName, tableType, activeReleaseId }) => {
  let jobType = "";
  // Derive job type from tableType
  if (tableType === DQD_TABLE_TYPES.DATA_QUALITY_OVERVIEW || tableType === DQD_TABLE_TYPES.DATA_QUALITY_RESULTS) {
    jobType = "data-quality";
  } else if (tableType === DQD_TABLE_TYPES.DATA_CHARACTERIZATION) {
    jobType = "data-characterization";
  }

  const [refetchLatestFlowRun, setRefetchLatestFlowRun] = useState(0);
  const [latestFlowRun, loadingLatestFlowRun, errorLatestFlowRun] = useDatasetLatestFlowRun(
    jobType,
    datasetId,
    refetchLatestFlowRun,
    activeReleaseId
  );

  useEffect(() => {
    if (!latestFlowRun) {
      return;
    }
    //   Refetch latest flow run if flow run is still "in progress"
    const interval = setInterval(() => {
      setRefetchLatestFlowRun((refetch) => refetch + 1);
    }, 10000);

    // Clear interval if latest flow run is completed or "failed"
    if (latestFlowRun.state.type === "COMPLETED" || failedJobStates.includes(latestFlowRun.state.type)) {
      clearInterval(interval);
    }

    return (): void => clearInterval(interval);
  }, [latestFlowRun]);

  const renderDataQualityJobState = () => {
    // Flow has not completed succesfully
    if (failedJobStates.includes(latestFlowRun.state.type)) {
      return <>Latest job failed</>;
    }

    if (cancelledJobStates.includes(latestFlowRun.state.type)) {
      return <>Latest job cancelled</>;
    }

    if (inProgressJobStates.includes(latestFlowRun.state.type)) {
      return <Loader text={`Latest Data Quality job is ${latestFlowRun.state.type}`} />;
    }

    if (latestFlowRun.state.type === FlowRunJobStateTypes.COMPLETED) {
      if (tableType === DQD_TABLE_TYPES.DATA_QUALITY_OVERVIEW) {
        return <RenderDataQualityOverviewTable flowRunId={latestFlowRun.id} />;
      } else if (tableType === DQD_TABLE_TYPES.DATA_QUALITY_RESULTS) {
        return <RenderDataQualityResultsTable flowRunId={latestFlowRun.id} datasetName={datasetName} />;
      } else if (tableType === DQD_TABLE_TYPES.DATA_CHARACTERIZATION) {
        return <DataCharacterizationReports flowRunId={latestFlowRun.id} />;
      } else {
        return <>Incorrect tableType supplied</>;
      }
    }
  };

  return (
    <>
      {loadingLatestFlowRun ? (
        <Loader text="Loading Data Quality Latest Flow Run" />
      ) : errorLatestFlowRun ? (
        <div>{errorLatestFlowRun.message}</div>
      ) : latestFlowRun ? (
        renderDataQualityJobState()
      ) : (
        <>No job found</>
      )}
    </>
  );
};

interface RenderDataQualityOverviewTableProps {
  flowRunId: string;
}

const RenderDataQualityOverviewTable: FC<RenderDataQualityOverviewTableProps> = ({ flowRunId }) => {
  const [dqdOverview, loadingDqdOverview, errorDqdOverview] = useDataQualityOverviewFromId(flowRunId);

  return (
    <>
      {loadingDqdOverview ? (
        <Loader text="Loading DQD Overview" />
      ) : errorDqdOverview ? (
        <div>Error loading DQD Overview: {errorDqdOverview.message}</div>
      ) : (
        dqdOverview && (
          <>
            <OverviewTable data={dqdOverview}></OverviewTable>
          </>
        )
      )}
    </>
  );
};

interface RenderDataQualityResultsTableProps {
  flowRunId: string;
  datasetName: string;
}

const RenderDataQualityResultsTable: FC<RenderDataQualityResultsTableProps> = ({ flowRunId, datasetName }) => {
  const [dqdResults, loadingDqdResults, errorDqdResults] = useDataQualityResultsFromId(flowRunId);
  const [dqdOverview] = useDataQualityOverviewFromId(flowRunId);

  return (
    <>
      {loadingDqdResults ? (
        <Loader text="Loading DQD Results" />
      ) : errorDqdResults ? (
        <div>Error loading DQD Results: {errorDqdResults.message}</div>
      ) : (
        dqdResults && (
          <>
            <DownloadDataButtons data={dqdResults} overviewData={dqdOverview} datasetName={datasetName} />
            <DQDTable data={dqdResults}></DQDTable>
          </>
        )
      )}
    </>
  );
};
