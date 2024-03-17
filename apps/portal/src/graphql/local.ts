import { gql } from "@apollo/client";

export const GET_FEEDBACK = gql`
  query {
    feedback @client {
      type
      message
      description
      autoClose
    }
  }
`;
