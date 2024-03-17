import { gql } from "@apollo/client";

export const GET_MY_TENANT = gql`
  query {
    myTenants {
      id
      name
    }
  }
`;
