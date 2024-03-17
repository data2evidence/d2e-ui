import React, { ReactNode } from "react";
import { Card } from "@portal/components";

import "./ChartContainer.scss";

interface ChartContainerProps {
  title: string;
  children: ReactNode;
}

function ChartContainer({ title, children }: ChartContainerProps) {
  return (
    <div className="chart__container">
      <Card title={title} className="chart__card" borderRadius={7}>
        {children}
      </Card>
    </div>
  );
}

export default ChartContainer;
