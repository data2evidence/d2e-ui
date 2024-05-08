import { AppState } from "./states";
import { clearFeedback, setFeedback } from "./actions";
import { changeLocale } from "./actions/translation";
import { setActiveDatasetId, setActiveDatasetName, setActiveReleaseId } from "./actions/active-dataset";

export enum ACTION_TYPES {
  SET_FEEDBACK = "SET_FEEDBACK",
  CLEAR_FEEDBACK = "CLEAR_FEEDBACK",
  CHANGE_LOCALE = "CHANGE_LOCALE",
  SET_ACTIVE_DATASET_ID = "SET_ACTIVE_DATASET_ID",
  SET_ACTIVE_DATASET_NAME = "SET_ACTIVE_DATASET_NAME",
  SET_ACTIVE_RELEASE_ID = "SET_ACTIVE_RELEASE_ID",
}

type ActionType = keyof typeof ACTION_TYPES;
type ActionFunction = (state: AppState, payload?: any) => AppState;

const actionMap = new Map<ActionType, ActionFunction>([
  [ACTION_TYPES.SET_FEEDBACK, setFeedback],
  [ACTION_TYPES.CLEAR_FEEDBACK, clearFeedback],
  [ACTION_TYPES.CHANGE_LOCALE, changeLocale],
  [ACTION_TYPES.SET_ACTIVE_DATASET_ID, setActiveDatasetId],
  [ACTION_TYPES.SET_ACTIVE_DATASET_NAME, setActiveDatasetName],
  [ACTION_TYPES.SET_ACTIVE_RELEASE_ID, setActiveReleaseId],
]);

export interface DispatchType {
  type: ACTION_TYPES;
  payload?: any;
}

export const reducer = (state: AppState, { type, payload }: DispatchType) => {
  const mappedAction = actionMap.get(type);
  return mappedAction ? mappedAction(state, payload) : state;
};
