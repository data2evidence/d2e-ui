import { gql } from "@apollo/client";

export const GET_TENANTS = gql`
  query {
    tenants {
      id
      name
      system
      features {
        feature
      }
    }
  }
`;

export const TENANT_ALL_FEATURE = gql`
  query ($input: GetAllFeaturesInput!) {
    getAllFeatures(tenantAllFeaturesInput: $input) {
      feature
      tenantId
    }
  }
`;
