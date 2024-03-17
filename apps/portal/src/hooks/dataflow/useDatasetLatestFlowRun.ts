import { useCallback, useEffect, useState } from "react";
import { api } from "../../axios/api";
import { AppError } from "../../types";

export const useDatasetLatestFlowRun = (
  jobType: string,
  datasetId: string,
  refetch = 0,
  releaseId?: string
): [any, boolean, AppError | undefined] => {
  const [results, setResults] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError>();

  const fetchDatasetLatestFlowRun = useCallback(async () => {
    try {
      setLoading(refetch ? false : true);
      let results;
      if (releaseId) {
        results = await api.dataflow.getDatasetReleaseFlowRun(jobType, datasetId, releaseId);
      } else {
        results = await api.dataflow.getDatasetLatestFlowRun(jobType, datasetId);
      }
      setResults(results);
    } catch (error: any) {
      console.error(error);
      setError({ message: "An error occured while getting Data Quality Results" });
    } finally {
      setLoading(false);
    }
  }, [refetch, releaseId, jobType, datasetId]);

  useEffect(() => {
    fetchDatasetLatestFlowRun();
  }, [fetchDatasetLatestFlowRun]);

  return [results, loading, error];
};
