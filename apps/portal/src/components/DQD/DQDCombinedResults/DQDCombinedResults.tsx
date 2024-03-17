import React, { FC } from "react";
import { SubTitle, Loader } from "@portal/components";
import DQDTable from "../DQDTable/DQDTable";
import OverviewTable from "../Overview/OverviewTable/OverviewTable";
import { useDataQualityOverviewFromId, useDataQualityResultsFromId } from "../../../hooks";

interface DQDCombinedResultsProps {
  flowRunId: string;
}

const DQDCombinedResults: FC<DQDCombinedResultsProps> = ({ flowRunId }) => {
  const [dqdOverview, loadingDqdOverview, errorDqdOverview] = useDataQualityOverviewFromId(flowRunId);
  const [dqdResults, loadingDqdResults, errorDqdResults] = useDataQualityResultsFromId(flowRunId);
  return (
    <>
      {/* DQD Overview table */}
      {loadingDqdOverview ? (
        <Loader text="Loading DQD Overview" />
      ) : errorDqdOverview ? (
        <div>Error loading DQD Overview: {errorDqdOverview.message}</div>
      ) : (
        dqdOverview && (
          <>
            <SubTitle>Overview</SubTitle>
            <OverviewTable data={dqdOverview}></OverviewTable>
          </>
        )
      )}
      {/* DQD Results table */}
      {loadingDqdResults ? (
        <Loader text="Loading DQD Results" />
      ) : errorDqdResults ? (
        <div>Error loading DQD Results: {errorDqdResults.message}</div>
      ) : (
        dqdResults && (
          <>
            <SubTitle>Detail</SubTitle>
            <DQDTable data={dqdResults}></DQDTable>
          </>
        )
      )}
    </>
  );
};

export default DQDCombinedResults;
