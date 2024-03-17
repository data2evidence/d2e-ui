import { gql } from "@apollo/client";

export const REPLACE_SYSTEM_FEATURES = gql`
  mutation ($input: ReplaceSystemFeaturesInput!) {
    replaceSystemFeatures(replaceSystemFeaturesInput: $input)
  }
`;

export const SYSTEM_ALL_FEATURE = gql`
  query ($input: GetSystemAllFeaturesInput!) {
    getSystemAllFeatures(systemAllFeaturesInput: $input) {
      feature
      systemName
      enabled
    }
  }
`;
