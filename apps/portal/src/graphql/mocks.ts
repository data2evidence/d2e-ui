import { MockedResponse } from "@apollo/client/testing";
import { GET_MY_TENANT } from "./my";
import { GET_STUDIES } from "./study";

export const MOCK_GET_MY_TENANT = (myTenants: any[]): MockedResponse<Record<string, any>> => ({
  request: {
    query: GET_MY_TENANT,
  },
  result: {
    data: {
      myTenants,
    },
  },
});

export const MOCK_GET_STUDIES = (studies: any[]): MockedResponse<Record<string, any>> => ({
  request: {
    query: GET_STUDIES,
  },
  result: {
    data: {
      studies,
    },
  },
});
