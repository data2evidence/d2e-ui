import React, { FC } from "react";

import ChartContainer from "../../ChartContainer";
import LineChart from "../../LineChart";

import "./DrilldownPrevalenceByMonthChart.scss";

interface DrilldownPrevalenceByMonthChartProps {
  data: any;
}

const DrilldownPrevalenceByMonthChart: FC<DrilldownPrevalenceByMonthChartProps> = ({ data }) => {
  const title = "Prevalence by Month";
  const xAxisName = "Date";
  const yAxisName = "Prevalence per 1000 People";
  const tooltipFormat = "Date: {b}<br />Prevalence per 1000 People: {c}";
  const yAxisFormat = "{value}";

  if (data.length === 0) {
    return (
      <ChartContainer title={title}>
        <div className="no_data_text">No data</div>
      </ChartContainer>
    );
  }

  // Parse and format line chart data
  // Parse X_CALENDAR_MONTH from e.g 200910 -> 10/2009
  const lineChartXAxisData = data.map(
    (obj: any) => obj["X_CALENDAR_MONTH"].toString().slice(-2) + "/" + obj["X_CALENDAR_MONTH"].toString().slice(0, 4)
  );

  const series = [
    {
      type: "line",
      data: data.map((obj: any) => Number(obj["Y_PREVALENCE_1000_PP"]).toFixed()),
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
        lineChartFormatConfig={{ tooltipFormat, yAxisFormat }}
      />
    </div>
  );
};

export default DrilldownPrevalenceByMonthChart;
