import React, { FC } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@portal/components";
import { useDashboard } from "../../hooks";
import { useTranslation, useUser } from "../../contexts";

export const Dashboard: FC = () => {
  const { getText, i18nKeys } = useTranslation();
  const { id } = useParams();
  const [dashboard] = useDashboard(id || "");
  const { user } = useUser();

  return (
    <Box height="100%" display="flex" flexDirection="column" justifyContent="center">
      {user && !user.isDashboardViewer ? (
        <Box display="flex" justifyContent="center">
          <h2>{getText(i18nKeys.DASHBOARD__NOT_ENOUGH_PRIVILEGES)}</h2>
        </Box>
      ) : dashboard ? (
        <iframe title={dashboard.name} src={dashboard.url} width="100%" height="100%" />
      ) : (
        <Box display="flex" justifyContent="center">
          <h2>{getText(i18nKeys.DASHBOARD__NOT_FOUND)}</h2>
        </Box>
      )}
    </Box>
  );
};
