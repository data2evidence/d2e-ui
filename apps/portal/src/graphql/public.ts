import { gql } from "@apollo/client";

// queries made for public data should begin with "public"
// if not the regex will deem it invalid
export const GET_PUBLIC_STUDIES = gql`
  query {
    publicStudies {
      id
      tokenStudyCode
      studyDetail {
        id
        name
        description
        summary
        showTokenGen
        tokenGenText
        showRequestAccess
      }
      studyMetadata {
        id
        name
        value
      }
      studyTags {
        id
        name
      }
      studyResourceUrls {
        id
        type
        url
      }
      tenant {
        id
        name
      }
    }
  }
`;

export const GET_PUBLIC_TENANTS = gql`
  query {
    publicTenants {
      id
      name
      system
    }
  }
`;
