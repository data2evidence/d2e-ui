import React, { FC, useEffect, useState, useCallback } from "react";

import { api } from "../../../../axios/api";
import { Loader } from "@portal/components";
import PieChart from "../../Common/PieChart";
import BoxPlotChart from "../../Common/BoxPlotChart";
import BarChart from "../../Common/BarChart";
import TreeMapChartTable from "../../Common/TreeMap/TreeMapChartTable";
import DrilldownTrellisChart from "../../Common/Drilldown/DrilldownTrellisChart/DrilldownTrellisChart";
import DrilldownPrevalenceByMonthChart from "../../Common/Drilldown/DrilldownPrevalenceByMonthChart/DrilldownPrevalenceByMonthChart";

import { parseDrilldownPieChartData, parseDrilldownBarChartData } from "../../util";

import { DRILLDOWN_REPORT_BASE_TYPE } from "../../../DQD/types";
import "./SharedDrilldown.scss";

interface SharedDrilldownProps {
  flowRunId: string;
  sourceKey: string;
}

const SharedDrilldown: FC<SharedDrilldownProps> = ({ flowRunId, sourceKey }) => {
  const [data, setData] = useState({
    treemap: [],
  });
  const [isloadingData, setIsLoadingData] = useState(true);
  const [err, setErr] = useState("");

  const [selectedConceptId, setSelectedConceptId] = useState<string>("");
  const [drilldownData, setDrilldownData] = useState<DRILLDOWN_REPORT_BASE_TYPE>({});
  const [isloadingDrilldownData, setIsLoadingDrilldownData] = useState(false);
  const [errDrilldown, setErrDrilldown] = useState("");

  const getData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const result = await api.dataflow.getDataCharacterizationResults(flowRunId, sourceKey);
      setData(result);
      setIsLoadingData(false);
      setErr("");
    } catch (error) {
      console.error(error);
      setIsLoadingData(false);
      setErr(`Error occured when fetching data characterization ${sourceKey} data`);
    }
  }, [flowRunId, sourceKey]);

  const getDrilldownData = useCallback(async () => {
    if (selectedConceptId === "") return;
    setIsLoadingDrilldownData(true);
    try {
      const result = await api.dataflow.getDataCharacterizationResultsDrilldown(
        flowRunId,
        sourceKey,
        selectedConceptId
      );
      setDrilldownData(result as DRILLDOWN_REPORT_BASE_TYPE);
      setIsLoadingDrilldownData(false);
      setErrDrilldown("");
    } catch (error) {
      console.error(error);
      setIsLoadingDrilldownData(false);
      setErrDrilldown(`Error occured when fetching data characterization ${sourceKey} data`);
    }
  }, [flowRunId, sourceKey, selectedConceptId]);

  useEffect(() => {
    // Fetch data for charts
    getData();
  }, [getData]);

  useEffect(() => {
    // Fetch data for drilldown
    getDrilldownData();
  }, [getDrilldownData]);

  const renderDrilldownCharts = () => {
    // Render drilldown charts based on which data is available
    return (
      <>
        {drilldownData.prevalenceByGenderAgeYear && (
          <DrilldownTrellisChart data={drilldownData.prevalenceByGenderAgeYear} />
        )}
        {drilldownData.prevalenceByMonth && <DrilldownPrevalenceByMonthChart data={drilldownData.prevalenceByMonth} />}
        <div className="chart__container">
          {drilldownData.byType && <PieChart title="Type" data={parseDrilldownPieChartData(drilldownData.byType)} />}
          {drilldownData.ageAtFirstOccurrence && (
            <BoxPlotChart
              data={drilldownData.ageAtFirstOccurrence}
              title={"Age at First Occurrence"}
              xAxisName={"Gender"}
              yAxisName={"Age at First Occurrence"}
            />
          )}
          {drilldownData.lengthOfEra && (
            <BoxPlotChart
              data={drilldownData.lengthOfEra}
              title={"Length of Era Distribution"}
              xAxisName={"Length of Era"}
              yAxisName={"Days"}
            />
          )}
        </div>

        <div className="chart__container">
          {drilldownData.byValueAsConcept && (
            <PieChart title={"Value As Concept"} data={parseDrilldownPieChartData(drilldownData.byValueAsConcept)} />
          )}
          {drilldownData.byOperator && (
            <PieChart title={"Operator Concept"} data={parseDrilldownPieChartData(drilldownData.byOperator)} />
          )}
          {drilldownData.byQualifier && (
            <PieChart title={"Qualifier Concept"} data={parseDrilldownPieChartData(drilldownData.byQualifier)} />
          )}
        </div>

        <div className="chart__container">
          {drilldownData.measurementValueDistribution && (
            <PieChart
              title={"Measurement Records by Unit"}
              data={parseDrilldownPieChartData(drilldownData.measurementValueDistribution)}
            />
          )}
          {/* // TODO: Measurement value distribution */}
        </div>
        <div className="chart__container">
          {/* // TODO: Lower limit Distribution */}
          {/* // TODO: Upper Limit Distribution */}
          {/* // TODO: Values Relative to Normal Range */}
        </div>
        {drilldownData.frequencyDistribution && (
          <BarChart
            barChartData={parseDrilldownBarChartData(drilldownData.frequencyDistribution)}
            title="Frequency Distribution"
            xAxisName='Count ("x" or more Procedures)'
            yAxisName="% of total number of persons"
            tooltipFormat="Count: {b}<br />% of total number of persons: {c}"
          />
        )}
      </>
    );
  };

  return (
    <>
      {isloadingData ? (
        <Loader text={`Loading ${sourceKey} Reports`} />
      ) : err ? (
        <div className="info__section">{err}</div>
      ) : (
        <div className="treemap-chart-table__container">
          {isloadingDrilldownData && (
            <div className="drilldown-loader">
              <Loader text={`Loading ${sourceKey} Drilldown for concept: ${selectedConceptId}`} />
            </div>
          )}
          <TreeMapChartTable title=" Tree Map" data={data.treemap} setSelectedConceptId={setSelectedConceptId} />
        </div>
      )}

      {selectedConceptId === "" ? (
        <></>
      ) : isloadingDrilldownData ? (
        // Loader is shown inside treemap TreeMapChartTable itself as a "popup" instead of here
        <></>
      ) : errDrilldown ? (
        <div className="info__section">{errDrilldown}</div>
      ) : (
        renderDrilldownCharts()
      )}
    </>
  );
};

export default SharedDrilldown;
