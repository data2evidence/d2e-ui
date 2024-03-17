import { gql } from "@apollo/client";

export const GET_STUDIES_AS_SUPER_ADMIN = gql`
  query {
    studiesRaw {
      id
      studyDetail {
        name
      }
      type
      tenantId
      tenant {
        name
        customDbName
      }
      studyMetadata {
        studyId
        name
        value
        dataType
      }
      studyTags {
        studyId
        id
        name
      }
      tokenStudyCode
      schemaName
      visibilityStatus
      studySystem {
        id
        name
      }
    }
  }
`;
