import React, { createContext, Dispatch, FC } from "react";
import { AppState, initialState } from "./states";
import { DispatchType, reducer } from "./reducer";
import { usePersistedReducer } from "../persisted-reducer";

export const AppContext = createContext<AppState>(initialState);
export const AppDispatchContext = createContext<Dispatch<DispatchType>>(() => undefined);

const storageKey = "d2e_app";
const whitelist: (keyof AppState)[] = ["activeDataset", "translation"];

interface AppProviderProps {
  children?: React.ReactNode;
}

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const { state, dispatch } = usePersistedReducer(reducer, initialState, storageKey, whitelist);

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppContext.Provider>
  );
};
