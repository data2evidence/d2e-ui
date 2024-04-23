import React, { FC, useCallback, useMemo, useState } from "react";
import { Box, MenuItem, Select, SelectChangeEvent } from "@portal/components";
import { DatasetDashboard } from "../../../../types";
import { useTranslation } from "../../../../contexts";

interface DatasetDashboardsProps {
  dashboards: DatasetDashboard[];
}

export const DatasetDashboards: FC<DatasetDashboardsProps> = ({ dashboards }) => {
  const { getText, i18nKeys } = useTranslation();
  const [activeDashboardName, setActiveDashboardName] = useState<string>("");
  const dashboard = useMemo(
    () => dashboards.find((d) => d.name === activeDashboardName),
    [activeDashboardName, dashboards]
  );

  const handleDashboardChange = useCallback((event: SelectChangeEvent) => {
    const dashboardId = event.target.value.toString();
    setActiveDashboardName(dashboardId);
  }, []);

  if (dashboards.length === 0) return null;

  return (
    <Box display="flex" flexDirection="column" mt={4}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <span>{getText(i18nKeys.DATASET_DASHBOARDS__DASHBOARD)}</span>
        <Select
          value={activeDashboardName}
          onChange={handleDashboardChange}
          displayEmpty
          sx={{
            width: "250px",
          }}
        >
          <MenuItem value="" disableRipple>
            {getText(i18nKeys.DATASET_DASHBOARDS__SELECT_DASHBOARD)}
          </MenuItem>
          {dashboards
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((dashboard: DatasetDashboard) => (
              <MenuItem value={dashboard.name} key={dashboard.name} disableRipple>
                {dashboard.name}
              </MenuItem>
            ))}
        </Select>
      </Box>
      {dashboard && <iframe title={dashboard.name} src={dashboard.url} width="100%" height="1000px" />}
    </Box>
  );
};
