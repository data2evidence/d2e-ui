import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, makeVar, NormalizedCacheObject } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { Feedback } from "./types";
import { authLogout, getAuthToken } from "./containers/auth";

export interface CreateApolloOptions {
  scopes?: string[];
  extraHeaders?: { [key: string]: string };
}

const errorLink = onError((error) => {
  const { graphQLErrors, networkError } = error;

  if (graphQLErrors)
    graphQLErrors.forEach(({ message, extensions }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${extensions ? extensions["code"] : ""}`);
    });

  if (networkError) {
    console.error("[Network error]", networkError);
  }
});

const createAuthLink = (options?: CreateApolloOptions) =>
  setContext(async () => {
    if (window.location.pathname.startsWith("/portal/public")) {
      const headers: { [key: string]: string } = {};
      headers["x-alp-portal-view"] = "public";
      return { headers };
    }

    try {
      const headers: { [key: string]: string } = {};
      const token = await getAuthToken();
      if (token) {
        headers["Authorization"] = token ? `Bearer ${token}` : "";
      }

      if (options?.extraHeaders) {
        return {
          headers: { ...headers, ...options.extraHeaders },
        };
      }

      return { headers };
    } catch (err) {
      console.error("[authLink]", err);
      await authLogout();
    }

    return {};
  });

export const EMPTY_FEEDBACK: Feedback = {
  type: "success",
  message: undefined,
  description: "",
  autoClose: 0,
};

export const feedbackVar = makeVar<Feedback>(EMPTY_FEEDBACK);
export const isDrawerOpenVar = makeVar(true);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        feedback: {
          read() {
            return feedbackVar();
          },
        },
        isDrawerOpen: {
          read() {
            return isDrawerOpenVar();
          },
        },
      },
    },
  },
});

export const setupApollo = (uri: string, options?: CreateApolloOptions): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    cache,
    link: ApolloLink.from([errorLink, createAuthLink(options), new HttpLink({ uri })]),
  });
