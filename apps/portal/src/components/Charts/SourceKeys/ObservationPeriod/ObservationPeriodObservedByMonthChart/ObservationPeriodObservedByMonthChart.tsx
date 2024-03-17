import React, { FC } from "react";

import LineChart from "../../../Common/LineChart";
import ChartContainer from "../../../Common/ChartContainer";

import "./ObservationPeriodObservedByMonthChart.scss";

interface ObservationPeriodObservedByMonthChartProps {
  data: any;
}

const ObservationPeriodObservedByMonthChart: FC<ObservationPeriodObservedByMonthChartProps> = ({ data }) => {
  const title = "Persons With Continuous Observation By Month";
  const xAxisName = "Date";
  const yAxisName = "People";
  const tooltipFormat = "Date: {b}<br />People: {c}";

  if (data.length === 0) {
    return (
      <ChartContainer title={title}>
        <div className="no_data_text">No data</div>
      </ChartContainer>
    );
  }

  // Sort data based on MONTHYEAR
  data = data.sort((a: any, b: any) => a["MONTHYEAR"] - b["MONTHYEAR"]);
  // Parse and format line chart data
  // Parse MONTHYEAR from e.g 200910 -> 10/2009
  const lineChartXAxisData = data.map(
    (obj: any) => obj["MONTHYEAR"].toString().slice(-2) + "/" + obj["MONTHYEAR"].toString().slice(0, 4)
  );
  const series = [
    {
      type: "line",
      data: data.map((obj: any) => obj["COUNTVALUE"]),
    },
  ];

  return (
    <div>
      <LineChart
        lineChartXAxisData={lineChartXAxisData}
        series={series}
        title={title}
        xAxisName={xAxisName}
        yAxisName={yAxisName}
        lineChartFormatConfig={{ tooltipFormat }}
      />
    </div>
  );
};

export default ObservationPeriodObservedByMonthChart;
