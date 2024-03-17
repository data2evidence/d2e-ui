import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, makeVar, NormalizedCacheObject } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { PublicClientApplication } from "@azure/msal-browser";
import { Feedback } from "./types";
import { getScopes, logout } from "./msalInstance";

export interface CreateApolloOptions {
  scopes?: string[];
  extraHeaders?: { [key: string]: string };
}

const errorLink = onError((error) => {
  const { graphQLErrors, networkError } = error;

  if (graphQLErrors)
    graphQLErrors.forEach(({ message, extensions }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${extensions?.code}`);
    });

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const createAuthLink = (msal: PublicClientApplication, options?: CreateApolloOptions) =>
  setContext(async () => {
    const scopes = options?.scopes || getScopes();
    const accounts = await msal.getAllAccounts();

    try {
      const headers: { [key: string]: string } = {};

      const response = await msal.acquireTokenSilent({
        scopes,
        account: accounts[0],
      });
      const token = response.idToken.toString();

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
      console.error(`[authLink]: ${err}`);
      await logout(msal, accounts);
    }
  });

export const EMPTY_FEEDBACK: Feedback = {
  type: "success",
  message: undefined,
  description: "",
  autoClose: 0,
};
export const feedbackVar = makeVar<Feedback>(EMPTY_FEEDBACK);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        feedback: {
          read() {
            return feedbackVar();
          },
        },
      },
    },
  },
});

export const setupApollo = (
  uri: string,
  msal: PublicClientApplication,
  options?: CreateApolloOptions
): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    cache,
    link: ApolloLink.from([errorLink, createAuthLink(msal, options), new HttpLink({ uri })]),
  });
