import React, { FC } from "react";
import ChartContainer from "../../ChartContainer";
import TrellisChart from "../../TrellisChart";

import "./DrilldownTrellisChart.scss";
import { groupBy } from "lodash";

interface DrilldownTrellisChartProps {
  data: any;
  trellisXAxisKey?: string;
}

const DrilldownTrellisChart: FC<DrilldownTrellisChartProps> = ({ data, trellisXAxisKey = "Y_PREVALENCE_1000_PP" }) => {
  const title = "Prevalence";
  const trellisTopLabel = "Age Decile";
  const trellisBottomLabel = "Years of Observation";

  const series: any[] = [];
  const grid: any[] = [];
  const gridTitles: any[] = [
    {
      text: trellisTopLabel,
      top: "0",
      left: "center",
    },
    {
      text: trellisBottomLabel,
      top: "bottom",
      left: "center",
    },
  ];
  const xAxis: any[] = [];
  const yAxis: any[] = [];

  if (data.length === 0) {
    return (
      <ChartContainer title={title}>
        <div className="no_data_text">No data</div>
      </ChartContainer>
    );
  }

  // Group by trellis name -> parallel line chart
  const trellisData = groupBy(data, (obj: any) => obj.TRELLIS_NAME);

  // Calculate width for each grid
  const GRID_WIDTH = 90 / Object.keys(trellisData).length;
  const GRID_GAP = 5 / Object.keys(trellisData).length;
  const GRID_LEFT_MARGIN = 5;

  // Get keys from trellisData sorted
  const sortedTrellisNames = Object.keys(trellisData).sort();

  for (const [index, trellisName] of sortedTrellisNames.entries()) {
    let seriesData = trellisData[trellisName];
    grid.push({
      show: true,
      width: `${GRID_WIDTH}%`,
      height: "auto",
      left: `${index * (GRID_WIDTH + GRID_GAP) + GRID_LEFT_MARGIN}%`,
      borderColor: "black",
      borderWidth: 1,
      containLabel: true,
    });
    gridTitles.push({
      textAlign: "center",
      text: trellisName,
      top: "5%",
      left: `${index * (GRID_WIDTH + GRID_GAP) + GRID_WIDTH / 2 + GRID_LEFT_MARGIN}%`,
    });

    // Sort seriesData based on X_CALENDAR_YEAR
    seriesData = seriesData.sort((a: any, b: any) => a["X_CALENDAR_YEAR"] - b["X_CALENDAR_YEAR"]);
    // Get list of all unique "SERIES_NAME" in dat
    const seriesList = [...new Set(seriesData.map((obj: any) => obj["SERIES_NAME"]))];
    const lineChartXAxisData = [...new Set(seriesData.map((obj: any) => obj["X_CALENDAR_YEAR"]))];

    for (const seriesName of seriesList) {
      series.push({
        name: seriesName,
        type: "line",
        emphasis: {
          focus: "series",
        },
        label: {
          show: true,
          position: "top",
        },
        xAxisIndex: index,
        yAxisIndex: index,
        data: seriesData.reduce((acc: Array<any>, obj: any) => {
          if (obj["SERIES_NAME"] === seriesName) {
            acc.push(Number(obj[trellisXAxisKey]).toFixed(2));
          }
          return acc;
        }, []),
      });
    }
    xAxis.push({
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
      },
      axisLabel: {
        show: true,
      },
      gridIndex: index,
      position: "bottom",
      data: lineChartXAxisData,
    });
    yAxis.push({
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
      },
      gridIndex: index,
      // Only show y axis label only for leftmost chart in grid
      axisLabel: {
        show: index === 0 ? true : false,
      },
      // Only show y axis name for leftmost chart in grid
      ...(index === 0 && {
        name: "Prevalence per 1000 People",
        nameLocation: "middle",
        nameGap: 50,
        position: "left",
        nameTextStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
      }),
    });
  }

  return <TrellisChart series={series} grid={grid} gridTitles={gridTitles} title={title} xAxis={xAxis} yAxis={yAxis} />;
};

export default DrilldownTrellisChart;
