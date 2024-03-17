import React, { FC, useEffect, useState, useCallback } from "react";

import { api } from "../../../../axios/api";

import { Loader } from "@portal/components";

import BoxPlotChart from "../../Common/BoxPlotChart";
import DataDensityRecordsPerPersonChart from "../../SourceKeys/DataDensity/DataDensityRecordsPerPersonChart/DataDensityRecordsPerPersonChart";
import DataDensityTotalRecordsChart from "../../SourceKeys/DataDensity/DataDensityTotalRecordsChart/DataDensityTotalRecordsChart";

import { DATA_DENSITY_REPORT_TYPE, WEBAPI_CDMRESULTS_SOURCE_KEYS } from "../../../DQD/types";
import "./DataDensity.scss";

interface DataDensityProps {
  flowRunId: string;
}

const DataDensity: FC<DataDensityProps> = ({ flowRunId }) => {
  const [dataDensityData, setDataDensityData] = useState<DATA_DENSITY_REPORT_TYPE>({
    totalRecords: [],
    recordsPerPerson: [],
    conceptsPerPerson: [],
  });
  const [isloadingDataDensityData, setIsLoadingDataDensityData] = useState(true);
  const [errDataDensity, setErrDataDensity] = useState("");

  const getDataDensityData = useCallback(async () => {
    setIsLoadingDataDensityData(true);
    try {
      const result = await api.dataflow.getDataCharacterizationResults(
        flowRunId,
        WEBAPI_CDMRESULTS_SOURCE_KEYS.DATA_DENSITY
      );
      setDataDensityData(result as DATA_DENSITY_REPORT_TYPE);
      setIsLoadingDataDensityData(false);
      setErrDataDensity("");
    } catch (error) {
      console.error(error);
      setIsLoadingDataDensityData(false);
      setErrDataDensity(`Error occured when fetching data characterization data density data`);
    }
  }, [flowRunId]);

  useEffect(() => {
    // Fetch data for charts
    getDataDensityData();
  }, [getDataDensityData]);

  return (
    <>
      {isloadingDataDensityData ? (
        <Loader text="Loading Data Density Reports" />
      ) : errDataDensity ? (
        <div className="info__section">{errDataDensity}</div>
      ) : (
        <>
          <DataDensityTotalRecordsChart data={dataDensityData.totalRecords} />
          <DataDensityRecordsPerPersonChart data={dataDensityData.recordsPerPerson} />
          <BoxPlotChart
            data={dataDensityData.conceptsPerPerson}
            title={"Concepts Per Person"}
            xAxisName={"Concept Type"}
            yAxisName={"Concepts Per Person"}
          />
        </>
      )}
    </>
  );
};

export default DataDensity;
