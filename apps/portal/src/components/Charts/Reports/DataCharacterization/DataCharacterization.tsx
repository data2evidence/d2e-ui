import React, { FC } from "react";

import Dashboard from "../Dashboard/Dashboard";
import DataDensity from "../DataDensity/DataDensity";

import "./DataCharacterization.scss";

interface DataCharacterizationProps {
  flowRunId: string;
}

const DataCharacterization: FC<DataCharacterizationProps> = ({ flowRunId }) => {
  return (
    <>
      <Dashboard flowRunId={flowRunId} />
      <DataDensity flowRunId={flowRunId} />
    </>
  );
};

export default DataCharacterization;
