import React, { FC } from "react";
import ChartContainer from "../../../Common/ChartContainer";
import LineChart, { LineSeries } from "../../../Common/LineChart";
import { DomainContinuity } from "../../../../DQD/types";

interface DomainContinuityChartProps {
  data: DomainContinuity;
}

const DomainContinuityChart: FC<DomainContinuityChartProps> = ({ data }) => {
  const title = data.domain;
  const xAxisName = "CDM Release Date";
  const yAxisName = "No. of records";
  const records = data.records;

  if (records.length === 0) {
    return (
      <ChartContainer title={title}>
        <div className="no_data_text">No data</div>
      </ChartContainer>
    );
  }

  const xAxisData = records.map((record) => record.cdmReleaseDate);

  const series: LineSeries[] = [
    {
      type: "line",
      data: records.map((record) => record.count),
    },
  ];

  return (
    <div>
      <LineChart
        lineChartXAxisData={xAxisData}
        series={series}
        title={title}
        xAxisName={xAxisName}
        yAxisName={yAxisName}
      />
    </div>
  );
};

export default DomainContinuityChart;
