import { useCallback, useContext } from "react";
import { AppContext, AppDispatchContext } from "../AppContext";
import { ACTION_TYPES } from "../reducer";

export const useActiveDataset = () => {
  const { activeDataset } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);

  const setActiveDatasetId = useCallback(
    (datasetId: string) => {
      dispatch({ type: ACTION_TYPES.SET_ACTIVE_DATASET_ID, payload: datasetId });
    },
    [dispatch]
  );

  const setActiveDatasetName = useCallback(
    (datasetName: string) => {
      dispatch({ type: ACTION_TYPES.SET_ACTIVE_DATASET_NAME, payload: datasetName });
    },
    [dispatch]
  );

  const setActiveReleaseId = useCallback(
    (releaseId: string) => {
      dispatch({ type: ACTION_TYPES.SET_ACTIVE_RELEASE_ID, payload: releaseId });
    },
    [dispatch]
  );

  return { activeDataset, setActiveDatasetId, setActiveDatasetName, setActiveReleaseId };
};
