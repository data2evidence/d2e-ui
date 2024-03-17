import React, { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@portal/components";
import { useDashboard } from "../../hooks";
import { useUserInfo } from "../../contexts/UserContext";

export const Dashboard: FC = () => {
  const { id } = useParams();
  const [dashboard] = useDashboard(id || "");
  const { user } = useUserInfo();

  useEffect(() => {
    localStorage.removeItem("redirectUrl");
  }, []);

  return (
    <Box height="100%" display="flex" flexDirection="column" justifyContent="center">
      {user && !user.isDashboardViewer ? (
        <Box display="flex" justifyContent="center">
          <h2>Not enough privileges!</h2>
        </Box>
      ) : dashboard ? (
        <iframe title={dashboard.name} src={dashboard.url} width="100%" height="100%" />
      ) : (
        <Box display="flex" justifyContent="center">
          <h2>Dashboard not found!</h2>
        </Box>
      )}
    </Box>
  );
};
