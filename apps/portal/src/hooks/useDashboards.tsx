import { useCallback, useEffect, useState } from "react";
import { api } from "../axios/api";
import { AppError, DatasetDashboard } from "../types";

export const useDashboards = (refetch = 0): [DatasetDashboard[], boolean, AppError | undefined] => {
  const [dashboards, setDashboards] = useState<DatasetDashboard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError>();

  const fetchDashboards = useCallback(async () => {
    try {
      setLoading(refetch ? false : true);
      const dashboards = await api.systemPortal.getDashboards();
      setDashboards(dashboards);
    } catch (error: any) {
      if ("message" in error) {
        setError({ message: error.message });
      }
    } finally {
      setLoading(false);
    }
  }, [refetch]);

  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  return [dashboards, loading, error];
};
