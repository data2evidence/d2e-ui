import { FeedbackState } from "./feedback-state";

export interface AppState {
  feedback: FeedbackState | undefined;
}

export const initialState: AppState = {
  feedback: undefined,
};
