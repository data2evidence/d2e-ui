import { AppState } from "./states";
import { clearFeedback, setFeedback } from "./actions";

export enum ACTION_TYPES {
  SET_FEEDBACK = "SET_FEEDBACK",
  CLEAR_FEEDBACK = "CLEAR_FEEDBACK",
}

const actionMap = new Map([
  [ACTION_TYPES.SET_FEEDBACK, setFeedback],
  [ACTION_TYPES.CLEAR_FEEDBACK, clearFeedback],
]);

export interface DispatchType {
  type: ACTION_TYPES;
  payload?: any;
}

export const reducer = (state: AppState, { type, payload }: DispatchType) => {
  const mappedAction = actionMap.get(type);
  return mappedAction ? mappedAction(state, payload) : state;
};
