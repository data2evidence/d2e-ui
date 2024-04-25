import { FeedbackState } from "./feedback-state";
import { TranslationState, i18nDefault } from "./translation-state";

export interface AppState {
  feedback: FeedbackState | undefined;
  translation: TranslationState;
}

export const initialState: AppState = {
  feedback: undefined,
  translation: {
    locale: "default",
    translations: i18nDefault,
  },
};
