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

export const REPLACE_FEATURES = gql`
  mutation ($input: ReplaceFeaturesInput!) {
    replaceFeatures(replaceFeaturesInput: $input)
  }
`;

export const UPDATE_TENANT = gql`
  mutation ($input: UpdateTenantInput!) {
    updateTenant(updateTenantInput: $input) {
      id
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

export const GET_TENANT_SYSTEMS = gql`
  query {
    tenantSystems {
      name
    }
  }
`;
