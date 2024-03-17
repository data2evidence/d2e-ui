import { gql } from "@apollo/client";

export const GET_ALL_SYSTEM_APPS = gql`
  query {
    allSystemApps {
      systemId
      system
      apps {
        name
        url
      }
      host
      ad
    }
  }
`;

export const GET_LOGS = gql`
  query {
    logs {
      commandType
      description
      id
      userId
      createdDate
      userEmail
      system
    }
  }
`;
