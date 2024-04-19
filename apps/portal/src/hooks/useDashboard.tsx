import { useCallback, useEffect, useState } from "react";
import { api } from "../axios/api";
import { AppError, DatasetDashboard } from "../types";
import { TranslationContext } from "../contexts/TranslationContext";

export const useDashboard = (
  id: string,
  refetch = 0
): [DatasetDashboard | undefined, boolean, AppError | undefined] => {
  const { getText, i18nKeys } = TranslationContext();
  const [dashboard, setDashboard] = useState<DatasetDashboard>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError>();

  const fetchDashboards = useCallback(async () => {
    try {
      if (id) {
        setLoading(refetch ? false : true);
        const dashboard = await api.systemPortal.getDashboardById(id);
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
  }, [id, refetch]);

  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  return [dashboard, loading, error];
};
