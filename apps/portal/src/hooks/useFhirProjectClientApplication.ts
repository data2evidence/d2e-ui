import { useCallback, useEffect, useState } from "react";
import { api } from "../axios/api";
import { AppError, FhirClientApplication } from "../types";

export const useFhirProjectClientApplication = (
  projectName: string
): [FhirClientApplication | undefined, boolean, AppError | undefined] => {
  const [fhirProjectClientApplication, setFhirProjectClientApplication] = useState<FhirClientApplication>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError>();

  const fetchFhirProjectClientApplication = useCallback(async (projectName: string) => {
    try {
      setLoading(true);
      const fhirProjectClientApplication = await api.gateway.getFhirClientApplication(projectName);
      setFhirProjectClientApplication(fhirProjectClientApplication);
    } catch (error: any) {
      console.error(error);
      setError({ message: "An error occured while getting fhir project client credentials" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFhirProjectClientApplication(projectName);
  }, [fetchFhirProjectClientApplication, projectName]);
  return [fhirProjectClientApplication, loading, error];
};
