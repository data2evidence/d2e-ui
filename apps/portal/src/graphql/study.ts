import { gql } from "@apollo/client";

export const GET_STUDIES = gql`
  query {
    studies {
      id
      tokenStudyCode
      schemaName
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

export const GET_STUDY = gql`
  query ($id: String!) {
    study(id: $id) {
      id
      studyDetail {
        id
        name
        description
        showTokenGen
        tokenGenText
      }
      tenant {
        id
        name
      }
    }
  }
`;

export const GET_STUDIES_AS_SYSTEM_ADMIN = gql`
  query {
    studiesAsSystemAdmin {
      id
      studyDetail {
        id
        name
        description
        summary
        showTokenGen
        tokenGenText
        showRequestAccess
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

export const UPDATE_STUDY_METADATA_SURVEY = gql`
  mutation ($input: UpdateStudyMetadataInput!) {
    updateStudyMetadata(updateStudyMetadataInput: $input)
  }
`;

export const CREATE_STUDY_DETAIL = gql`
  mutation ($input: NewStudyDetailInput!) {
    createStudyDetail(newStudyDetailInput: $input) {
      id
    }
  }
`;

export const UPDATE_STUDY_DETAIL = gql`
  mutation ($input: UpdateStudyDetailInput!) {
    updateStudyDetail(updateStudyDetailInput: $input) {
      id
      studyId
      name
      summary
      description
      showTokenGen
      tokenGenText
      showRequestAccess
    }
  }
`;

export const OFFBOARD_STUDY = gql`
  mutation ($input: OffboardStudyInput!) {
    offboardStudy(offboardStudyInput: $input) {
      code
      success
      id
    }
  }
`;

export const GET_ALL_TOKEN_STUDY_CODES = gql`
  query {
    studiesRaw {
      tokenStudyCode
    }
  }
`;
