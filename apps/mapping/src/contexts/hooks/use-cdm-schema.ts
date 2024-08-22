import { useCallback, useContext } from "react";
import { AppContext, AppDispatchContext } from "../AppContext";
import { ACTION_TYPES } from "../reducers/reducer";
import { TableSchemaState } from "../states";

export const useCdmSchema = () => {
  const { cdmTables } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);

  const setCdmTables = useCallback((cdmTables: TableSchemaState[]) => {
    dispatch({ type: ACTION_TYPES.SET_CDM_TABLES, payload: cdmTables });
  }, []);

  return { setCdmTables, cdmTables };
};
