import { useCallback, useContext } from "react";
import { AppDispatchContext } from "../AppContext";
import { ACTION_TYPES } from "../reducers/reducer";

export const useApp = () => {
  const dispatch = useContext(AppDispatchContext);

  const reset = useCallback(() => {
    dispatch({ type: ACTION_TYPES.RESET });
  }, []);

  const clearHandles = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLEAR_HANDLES });
  }, []);

  return { reset, clearHandles };
};
