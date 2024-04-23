import { AppState } from "./states";
import { clearFeedback, setFeedback } from "./actions";
import { changeLocale } from "./actions/translation";

export enum ACTION_TYPES {
  SET_FEEDBACK = "SET_FEEDBACK",
  CLEAR_FEEDBACK = "CLEAR_FEEDBACK",
  CHANGE_LOCALE = "CHANGE_LOCALE",
}

const actionMap = new Map([
  [ACTION_TYPES.SET_FEEDBACK, setFeedback as (...args: any[]) => AppState],
  [ACTION_TYPES.CLEAR_FEEDBACK, clearFeedback],
  [ACTION_TYPES.CHANGE_LOCALE, changeLocale],
]);

export interface DispatchType {
  type: ACTION_TYPES;
  payload?: any;
}

export const reducer = (state: AppState, { type, payload }: DispatchType) => {
  const mappedAction = actionMap.get(type);
  return mappedAction ? mappedAction(state, payload) : state;
};
