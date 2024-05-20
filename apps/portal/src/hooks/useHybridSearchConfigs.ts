import { useCallback, useEffect, useState } from "react";
import { api } from "../axios/api";
import { AppError } from "../types";
import { HybridSearchConfig } from "../plugins/Researcher/Terminology/utils/types";

export const useHybridSearchConfigs = (): [HybridSearchConfig, boolean, AppError | undefined] => {
  const [configs, setConfigs] = useState<HybridSearchConfig>({
    id: 1,
    isEnabled: false,
    semanticRatio: 0.5,
    model: "neuml/pubmedbert-base-embeddings",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError>();

  const fetchConfigs = useCallback(async () => {
    try {
      setLoading(true);
      const configs = await api.terminology.getHybridSearchConfig();
      setConfigs(configs);
    } catch (error: any) {
      if ("message" in error) {
        setError({ message: error.message });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  return [configs, loading, error];
};
