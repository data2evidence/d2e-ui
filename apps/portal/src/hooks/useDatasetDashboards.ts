import { useCallback, useEffect, useState } from "react";
import { api } from "../axios/api";
import { AppError, DatasetDashboard } from "../types";
import { useUser } from "../contexts";

export const useDatasetDashboards = (
  datasetId: string,
  refetch = 0
): [DatasetDashboard[], boolean, AppError | undefined] => {
  const [dashboards, setDashboards] = useState<DatasetDashboard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError>();
  const { user } = useUser();

  const fetchDashboards = useCallback(async () => {
    try {
      setLoading(refetch ? false : true);
      const dashboards = await api.gateway.getDatasetDashboards(datasetId);
      setDashboards(dashboards);
    } catch (error: any) {
      if ("message" in error) {
        setError({ message: error.message });
      }
    } finally {
      setLoading(false);
    }
  }, [datasetId, refetch]);

  useEffect(() => {
    if (user.isDashboardViewer) {
      fetchDashboards();
    }
  }, [user, fetchDashboards]);

  return [dashboards, loading, error];
};
