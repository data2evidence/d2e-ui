import React, { FC, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@portal/components";
import { useDashboard } from "../../hooks";
import { getAuthToken } from "../auth";
import { useTranslation, useUser } from "../../contexts";
import env from "../../env";

export const Dashboard: FC = () => {
  const { getText, i18nKeys } = useTranslation();
  const { name } = useParams();
  const [dashboard] = useDashboard(name || "");
  const { user } = useUser();
  const [token, setToken] = useState<string>();

  const getToken = useCallback(async () => {
    const token = await getAuthToken();
    if (token) setToken(token);
  }, []);

  useEffect(() => {
    getToken();
  }, []);

  if (dashboard == null || token == null) return null;

  if (dashboard.id == null) {
    return (
      <Box display="flex" justifyContent="center">
        <h2>{getText(i18nKeys.DASHBOARD__NOT_FOUND)}</h2>
      </Box>
    );
  }

  if (user && !user.isDashboardViewer) {
    return (
      <Box display="flex" justifyContent="center">
        <h2>{getText(i18nKeys.DASHBOARD__NOT_ENOUGH_PRIVILEGES)}</h2>
      </Box>
    );
  }

  return (
    <Box height="100%" display="flex" flexDirection="column" justifyContent="center">
      <iframe
        title={dashboard.name}
        src={`${env.REACT_APP_DN_BASE_URL}dashboard-gate/${dashboard.id}/content?token=${token}`}
        width="100%"
        height="100%"
      />
    </Box>
  );
};
