import React, { FC, useEffect, useState, useCallback } from "react";

import { api } from "../../../../axios/api";
import { Loader } from "@portal/components";

import PieChart from "../../Common/PieChart";
import BoxPlotChart from "../../Common/BoxPlotChart";
import BarChart from "../../Common/BarChart";
import ObservationPeriodCumulativeDurationChart from "../../SourceKeys/ObservationPeriod/ObservationPeriodCumulativeDurationChart/ObservationPeriodCumulativeDurationChart";
import ObservationPeriodObservedByMonthChart from "../../SourceKeys/ObservationPeriod/ObservationPeriodObservedByMonthChart/ObservationPeriodObservedByMonthChart";

import { parsePieChartData, parseDaysToYears, parseBarChartData } from "../../util";

import { OBSERVATION_PERIOD_REPORT_TYPE, WEBAPI_CDMRESULTS_SOURCE_KEYS } from "../../../DQD/types";
import "./ObservationPeriod.scss";

interface ObservationPeriodProps {
  flowRunId: string;
}

const ObservationPeriod: FC<ObservationPeriodProps> = ({ flowRunId }) => {
  const [observationPeriodData, setObservationPeriodData] = useState<OBSERVATION_PERIOD_REPORT_TYPE>({
    ageAtFirst: [],
    ageByGender: [],
    cumulativeDuration: [],
    observationLengthData: [],
    observationLengthStats: [],
    observationLengthByAge: [],
    observationLengthByGender: [],
    observedByMonth: [],
    observedByYearData: [],
    observedByYearStats: [],
    periodsPerPerson: [],
  });
  const [isloadingObservationPeriodData, setIsLoadingObservationPeriodData] = useState(true);
  const [errObservationPeriod, setErrObservationPeriod] = useState("");

  const getObservationPeriodData = useCallback(async () => {
    setIsLoadingObservationPeriodData(true);
    try {
      const result = await api.dataflow.getDataCharacterizationResults(
        flowRunId,
        WEBAPI_CDMRESULTS_SOURCE_KEYS.OBSERVATION_PERIOD
      );
      setObservationPeriodData(result as OBSERVATION_PERIOD_REPORT_TYPE);
      setIsLoadingObservationPeriodData(false);
      setErrObservationPeriod("");
    } catch (error) {
      console.error(error);
      setIsLoadingObservationPeriodData(false);
      setErrObservationPeriod(`Error occured when fetching data characterization observationPeriod data`);
    }
  }, [flowRunId]);

  useEffect(() => {
    // Fetch data for charts
    getObservationPeriodData();
  }, [getObservationPeriodData]);

  return (
    <>
      {isloadingObservationPeriodData ? (
        <Loader text="Loading ObservationPeriod Reports" />
      ) : errObservationPeriod ? (
        <div className="info__section">{errObservationPeriod}</div>
      ) : (
        <>
          <div className="imbalanced__container">
            <BarChart
              barChartData={parseBarChartData(observationPeriodData.ageAtFirst)}
              title="Age at First Observation"
              xAxisName="Age"
              yAxisName="People"
              tooltipFormat="Age: {b}<br />Number of People: {c}"
            />
            <BoxPlotChart
              data={observationPeriodData.ageByGender}
              title={"Age by Death"}
              xAxisName={"Gender"}
              yAxisName={"Age"}
            />
          </div>
          <div className="imbalanced__container">
            <BarChart
              barChartData={parseBarChartData(
                observationPeriodData.observationLengthData,
                observationPeriodData.observationLengthStats[0].MINVALUE,
                true
              )}
              title="Observation Length"
              xAxisName="Years"
              yAxisName="People"
              tooltipFormat="Year: {b}<br />People: {c}"
            />
            <BoxPlotChart
              data={parseDaysToYears(observationPeriodData.observationLengthByGender)}
              title={"Duration by Gender"}
              xAxisName={"Gender"}
              yAxisName={"Years"}
            />
          </div>
          <div className="chart__container">
            <ObservationPeriodCumulativeDurationChart data={observationPeriodData.cumulativeDuration} />
            <BoxPlotChart
              data={parseDaysToYears(observationPeriodData.observationLengthByAge)}
              title={"Duration by Age Decile"}
              xAxisName={"Age Decile"}
              yAxisName={"Years"}
            />
          </div>
          <div className="imbalanced__container">
            <BarChart
              barChartData={parseBarChartData(
                observationPeriodData.observedByYearData,
                observationPeriodData.observedByYearStats[0].MINVALUE
              )}
              title="Persons With Continous Observation By Year"
              xAxisName="Year"
              yAxisName="People"
              tooltipFormat="Year: {b}<br />People: {c}"
            />
            <PieChart
              data={parsePieChartData(observationPeriodData.periodsPerPerson)}
              title="Observation Periods per Person"
            />
          </div>
          <ObservationPeriodObservedByMonthChart data={observationPeriodData.observedByMonth} />
        </>
      )}
    </>
  );
};

export default ObservationPeriod;
