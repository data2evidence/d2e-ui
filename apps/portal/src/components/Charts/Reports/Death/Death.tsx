import React, { FC, useEffect, useState, useCallback } from "react";

import { api } from "../../../../axios/api";
import { Loader } from "@portal/components";

import PieChart from "../../Common/PieChart";
import BoxPlotChart from "../../Common/BoxPlotChart";
import DrilldownTrellisChart from "../../Common/Drilldown/DrilldownTrellisChart/DrilldownTrellisChart";
import DeathPrevalenceByMonthChart from "../../SourceKeys/Death/DeathPrevalenceByMonthChart/DeathPrevalenceByMonthChart";

import { parsePieChartData } from "../../util";

import { DEATH_REPORT_TYPE, WEBAPI_CDMRESULTS_SOURCE_KEYS } from "../../../DQD/types";
import "./Death.scss";

interface DeathProps {
  flowRunId: string;
}

const Death: FC<DeathProps> = ({ flowRunId }) => {
  const [deathData, setDeathData] = useState<DEATH_REPORT_TYPE>({
    ageAtDeath: [],
    deathByType: [],
    prevalenceByGenderAgeYear: [],
    prevalenceByMonth: [],
  });
  const [isloadingDeathData, setIsLoadingDeathData] = useState(true);
  const [errDeath, setErrDeath] = useState("");

  const getDeathData = useCallback(async () => {
    setIsLoadingDeathData(true);
    try {
      const result = await api.dataflow.getDataCharacterizationResults(flowRunId, WEBAPI_CDMRESULTS_SOURCE_KEYS.DEATH);
      setDeathData(result as DEATH_REPORT_TYPE);
      setIsLoadingDeathData(false);
      setErrDeath("");
    } catch (error) {
      console.error(error);
      setIsLoadingDeathData(false);
      setErrDeath(`Error occured when fetching data characterization death data`);
    }
  }, [flowRunId]);

  useEffect(() => {
    // Fetch data for charts
    getDeathData();
  }, [getDeathData]);

  return (
    <>
      {isloadingDeathData ? (
        <Loader text="Loading Death Reports" />
      ) : errDeath ? (
        <div className="info__section">{errDeath}</div>
      ) : (
        <>
          <DrilldownTrellisChart data={deathData.prevalenceByGenderAgeYear} trellisXAxisKey="Y_PREVALENCE_1000PP" />
          <DeathPrevalenceByMonthChart data={deathData.prevalenceByMonth} />
          <div className="chart__container">
            <PieChart data={parsePieChartData(deathData.deathByType)} title="Death By Type" />
            <BoxPlotChart
              data={deathData.ageAtDeath}
              title={"Age at Death"}
              xAxisName={"Gender"}
              yAxisName={"Age at first occurence"}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Death;
