import { gql } from "@apollo/client";

export const GET_SYSTEM_DATABASES = gql`
  query {
    systemDatabases {
      system
      databases
    }
  }
`;
