import React, { FC } from "react";
import ChartContainer from "../../../Common/ChartContainer";
import LineChart, { LineSeries } from "../../../Common/LineChart";
import { HistoricalDataQualityMultiSeries } from "../../../../DQD/types";

interface HistoricalDataQualitySeriesChartProps {
  data: HistoricalDataQualityMultiSeries[];
  seriesType: "category" | "domain";
}

const HistoricalDataQualityMultiSeriesChart: FC<HistoricalDataQualitySeriesChartProps> = ({ data, seriesType }) => {
  const title = `Historical data quality by ${seriesType}`;
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

  const seriesNames = Object.keys(data[0].failed);
  const series: LineSeries[] = [];

  for (const seriesName of seriesNames) {
    series.push({
      name: seriesName,
      type: "line",
      emphasis: {
        focus: "series",
      },
      data: data.reduce((acc: number[], record) => {
        const failed = record.failed;
        if (failed.hasOwnProperty(seriesName)) {
          acc.push(failed[seriesName]);
        }
        return acc;
      }, []),
    });
  }

  const extraChartConfigs = {
    legend: {
      data: seriesNames,
    },
  };

  return (
    <div>
      <LineChart
        lineChartXAxisData={xAxisData}
        series={series}
        title={title}
        xAxisName={xAxisName}
        yAxisName={yAxisName}
        extraChartConfigs={extraChartConfigs}
      />
    </div>
  );
};

export default HistoricalDataQualityMultiSeriesChart;
