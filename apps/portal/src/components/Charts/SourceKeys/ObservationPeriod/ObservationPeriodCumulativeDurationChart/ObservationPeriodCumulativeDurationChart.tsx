import React, { FC } from "react";

import LineChart from "../../../Common/LineChart";
import ChartContainer from "../../../Common/ChartContainer";

import "./ObservationPeriodCumulativeDurationChart.scss";

interface ObservationPeriodCumulativeDurationChartProps {
  data: any;
}

const ObservationPeriodCumulativeDurationChart: FC<ObservationPeriodCumulativeDurationChartProps> = ({ data }) => {
  const title = "Cumulative Observation";
  const xAxisName = "Years";
  const yAxisName = "Percent of Population";
  const tooltipFormat = "Years: {b}<br />Percent of Population: {c}%";
  const yAxisFormat = "{value}%";

  if (data.length === 0) {
    return (
      <ChartContainer title={title}>
        <div className="no_data_text">No data</div>
      </ChartContainer>
    );
  }

  // Parse and format line chart data
  // Divide XLENGTHOFOBSERVATION by number of days in a year and round to 1 decimal place
  const lineChartXAxisData = data.map((obj: any) => (obj["XLENGTHOFOBSERVATION"] / 365.25).toFixed(1));
  // Convert YPERCENTPERSONS to percentage
  const series = [
    {
      type: "line",
      step: "start",
      data: data.map((obj: any) => (Number(obj["YPERCENTPERSONS"]) * 100).toFixed(0)),
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

export default ObservationPeriodCumulativeDurationChart;
