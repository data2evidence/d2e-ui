import { useCallback } from "react";
import { Feedback } from "../types";
import { EMPTY_FEEDBACK, feedbackVar } from "../apollo";
import { useQuery } from "@apollo/client";
import { GET_FEEDBACK } from "../graphql";

export const useFeedback = (): {
  setFeedback: (feedback: Feedback) => void;
  clearFeedback: () => void;
  getFeedback: () => Feedback | undefined;
  setGenericErrorFeedback: () => void;
} => {
  const { data } = useQuery<{ feedback: Feedback }>(GET_FEEDBACK);

  const setFeedback = useCallback((feedback: Feedback) => {
    feedbackVar({ ...EMPTY_FEEDBACK, ...feedback });
  }, []);

  const clearFeedback = useCallback(() => {
    feedbackVar(EMPTY_FEEDBACK);
  }, []);

  const getFeedback = useCallback(() => {
    return data?.feedback;
  }, [data?.feedback]);

  const setGenericErrorFeedback = useCallback(() => {
    setFeedback({
      type: "error",
      message: "An error has occurred.",
      description: "Please try again. To report the error, please send an email to help@data4life.care.",
    });
  }, [setFeedback]);

  return { setFeedback, clearFeedback, getFeedback, setGenericErrorFeedback };
};
