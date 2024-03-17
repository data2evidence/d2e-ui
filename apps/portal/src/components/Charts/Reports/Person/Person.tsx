import React, { FC, useEffect, useState, useCallback } from "react";

import { api } from "../../../../axios/api";
import { Loader } from "@portal/components";

import PieChart from "../../Common/PieChart";
import BarChart from "../../Common/BarChart";

import { parsePieChartData, parseBarChartData } from "../../util";

import { PERSON_REPORT_TYPE, WEBAPI_CDMRESULTS_SOURCE_KEYS } from "../../../DQD/types";
import "./Person.scss";

interface PersonProps {
  flowRunId: string;
}

const Person: FC<PersonProps> = ({ flowRunId }) => {
  const [personData, setPersonData] = useState<PERSON_REPORT_TYPE>({
    population: [],
    gender: [],
    race: [],
    ethnicity: [],
    yearOfBirthData: [],
    yearOfBirthStats: [],
  });
  const [isloadingPersonData, setIsLoadingPersonData] = useState(true);
  const [errPerson, setErrPerson] = useState("");

  const getPersonData = useCallback(async () => {
    setIsLoadingPersonData(true);
    try {
      const result = await api.dataflow.getDataCharacterizationResults(flowRunId, WEBAPI_CDMRESULTS_SOURCE_KEYS.PERSON);
      setPersonData(result as PERSON_REPORT_TYPE);
      setIsLoadingPersonData(false);
      setErrPerson("");
    } catch (error) {
      console.error(error);
      setIsLoadingPersonData(false);
      setErrPerson(`Error occured when fetching data characterization person data`);
    }
  }, [flowRunId]);

  useEffect(() => {
    // Fetch data for charts
    getPersonData();
  }, [getPersonData]);

  return (
    <>
      {isloadingPersonData ? (
        <Loader text="Loading Person Reports" />
      ) : errPerson ? (
        <div className="info__section">{errPerson}</div>
      ) : (
        <>
          <BarChart
            barChartData={parseBarChartData(personData.yearOfBirthData, personData.yearOfBirthStats[0].MINVALUE)}
            title="Year of Birth"
            xAxisName="Year"
            yAxisName="# of Persons"
            tooltipFormat="Year: {b}<br /># of Persons: {c}"
          />
          <div className="chart__container">
            <PieChart data={parsePieChartData(personData.gender)} title="Gender" />
            <PieChart data={parsePieChartData(personData.race)} title="Race" />
            <PieChart data={parsePieChartData(personData.ethnicity)} title="Ethnicity" />
          </div>
        </>
      )}
    </>
  );
};

export default Person;
