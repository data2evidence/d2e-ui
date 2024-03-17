import React, { FC } from "react";
import ChartContainer from "../../../Common/ChartContainer";
import LineChart, { LineSeries } from "../../../Common/LineChart";
import { HistoricalDataQuality } from "../../../../DQD/types";

interface HistoricalDataQualityChartProps {
  data: HistoricalDataQuality[];
}

const HistoricalDataQualityChart: FC<HistoricalDataQualityChartProps> = ({ data }) => {
  const title = "Historical data quality";
  const xAxisName = "CDM Release Date";
  const yAxisName = "Checks Failed";

  if (data.length === 0) {
    return (
      <ChartContainer title={title}>
        <div className="no_data_text">No data</div>
      </ChartContainer>
    );
  }

  const xAxisData = data.map((record) => record.cdmReleaseDate);

  const series: LineSeries[] = [
    {
      type: "line",
      data: data.map((record) => record.failed),
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

export default HistoricalDataQualityChart;
