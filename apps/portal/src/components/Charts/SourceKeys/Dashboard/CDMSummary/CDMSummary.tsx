import React from "react";

import ChartContainer from "../../../Common/ChartContainer";
import "./CDMSummary.scss";

interface CDMSummaryProps {
  data: any;
}

function CDMSummary({ data }: CDMSummaryProps) {
  const title = "CDM Summary";

  if (data.length === 0) {
    return (
      <ChartContainer title={title}>
        <div className="no_data_text">No data</div>
      </ChartContainer>
    );
  }
  // Extract source name and number of persons from data
  const sourceName = data.filter((obj: any) => obj["ATTRIBUTE_NAME"] === "Source name")[0]["ATTRIBUTE_VALUE"];
  const numberOfPersons = data.filter((obj: any) => obj["ATTRIBUTE_NAME"] === "Number of persons")[0][
    "ATTRIBUTE_VALUE"
  ];

  return (
    <ChartContainer title={title}>
      <p>Source name: {sourceName}</p>
      <p>Number of persons: {numberOfPersons}</p>
    </ChartContainer>
  );
}

export default CDMSummary;
