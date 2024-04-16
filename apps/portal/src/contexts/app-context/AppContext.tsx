import React, { createContext, Dispatch, FC, useReducer } from "react";
import { AppState, initialState } from "./states";
import { DispatchType, reducer } from "./reducer";

export const AppContext = createContext<AppState>(initialState);
export const AppDispatchContext = createContext<Dispatch<DispatchType>>(() => undefined);

interface AppProviderProps {
  children?: React.ReactNode;
}

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppContext.Provider>
  );
};
