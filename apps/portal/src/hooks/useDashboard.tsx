import { useCallback, useEffect, useState } from "react";
import { api } from "../axios/api";
import { AppError, DatasetDashboard } from "../types";
import { useTranslation } from "../contexts";

export const useDashboard = (name: string, refetch = 0): [DatasetDashboard | undefined, boolean, AppError | undefined] => {
  const { getText, i18nKeys } = useTranslation();
  const [dashboard, setDashboard] = useState<DatasetDashboard>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError>();

  const fetchDashboards = useCallback(async () => {
    try {
      if (name) {
        setLoading(refetch ? false : true);
        const dashboard = await api.systemPortal.getDashboardByName(name);
        setDashboard(dashboard);
      } else {
        setError({ message: getText(i18nKeys.USE_DASHBOARD__ERROR) });
      }
    } catch (error: any) {
      if ("message" in error) {
        setError({ message: error.message });
      }
    } finally {
      setLoading(false);
    }
  }, [name, refetch]);

  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  return [dashboard, loading, error];
};
