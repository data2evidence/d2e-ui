import { useCallback, useEffect, useState } from "react";
import { api } from "../axios/api";
import { AppError, OverviewDescription } from "../types";

export const useOverviewDescription = (
  isPublic?: boolean,
  refetch = 0
): [OverviewDescription, boolean, AppError | undefined] => {
  const [overviewDescription, setOverviewDescription] = useState<OverviewDescription>({ id: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError>();

  const fetchoverviewDescription = useCallback(async () => {
    let overviewDescription;
    try {
      setLoading(refetch ? false : true);
      if (isPublic) {
        overviewDescription = await api.systemPortal.getPublicOverviewDescription();
      } else {
        overviewDescription = await api.systemPortal.getOverviewDescription();
      }
      setOverviewDescription(overviewDescription);
    } catch (error: any) {
      if ("message" in error) {
        setError({ message: error.message });
      }
    } finally {
      setLoading(false);
    }
  }, [refetch]);

  useEffect(() => {
    fetchoverviewDescription();
  }, [fetchoverviewDescription]);

  return [overviewDescription, loading, error];
};
