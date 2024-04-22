import { AppState, FeedbackState, initialState } from "../states";

export const setFeedback = (state: AppState, payload: FeedbackState | undefined) => ({
  ...state,
  feedback: payload,
});

export const clearFeedback = (state: AppState) => ({
  ...state,
  feedback: initialState.feedback,
});
