import env from "../env";
import request from "./request";
import fetchRequest from "../fetch/request";
import { ResponseType } from "axios";
import QueryString from "../../src/utils/mri/QueryString";
import QueryBuilder from "../../src/utils/mri/QueryBuilder";
import QueryModelBuilder from "../../src/utils/mri/ifr/QueryModelBuilder";

const MRI_BASE_URL = `${env.REACT_APP_DN_BASE_URL}analytics-svc`;

const MRI_CONFIG_NAME = env.REACT_APP_MRI_CONFIG_NAME || "";

/**
 * General MRI Query
 * @see QueryBuilder , QueryModelBuilder and QueryString to build
 * @param url : String
 * @param responseType : string of type 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'
 * @returns Request Object
 */
function queryMri(url: string, cancelToken: any): Promise<any> {
  return fetchRequest(`${MRI_BASE_URL}${url}`, {
    method: "get",
    signal: cancelToken.signal,
  });
}

/**
 * Get MRI Config List
 * @param studyId : String
 * @returns Object of MRI Config List
 */
function getMyConfig(studyId: string): Promise<any> {
  return request({
    baseURL: MRI_BASE_URL,
    url: `/pa/services/analytics.xsjs?action=getMyConfigList&selectedStudyId=${studyId}`,
    method: "GET",
  });
}

/**
 * Builds the mriQuery for Patient
 */
function createPatientCountMriQueryBuilder() {
  const mriQueryBuilder = new QueryBuilder();
  const queryModelBuilder = new QueryModelBuilder();
  const patient = queryModelBuilder.patient();
  const criteriaGroup = queryModelBuilder.criteriaGroup().matchAnyFilters([patient]);
  mriQueryBuilder.addCriteriaGroup(criteriaGroup);
  return mriQueryBuilder;
}

/**
 * Gets Config List For a Particular Study
 * Prioritise config set in env REACT_APP_MRI_CONFIG_NAME
 * @param studyId : String
 * @returns Object of MRI Config List if Exist
 */
function getStudyConfig(studyId: string): Promise<any> {
  const failedResponse = {
    responseStatus: "Failed",
  };

  const portalConfig = getMyConfig(studyId)
    .then((configs) => {
      // Try to find it from environment
      if (MRI_CONFIG_NAME !== "") {
        return configs.find((mriConfig: any) => mriConfig.meta.configName === MRI_CONFIG_NAME);
      } else {
        // find it from the studyID
        return configs.find((mriConfig: any) => mriConfig.meta.assignmentEntityValue === studyId);
      }
    })
    .catch(() => {
      console.error("MRI Config is not found");
      throw failedResponse;
    });

  if (portalConfig === undefined) {
    console.error("Portal config not found");
    throw failedResponse;
  }

  return portalConfig;
}

/**
 * Gets Patient count for selected study
 * @param studyId : String
 * @returns number of patients or undefined if non-exist
 * @see getStudyConfig
 */
async function getPatientCount(studyId: string): Promise<any> {
  // Fetch MRI config assigned to study
  let portalConfig;
  try {
    portalConfig = await getStudyConfig(studyId);
  } catch (err: any) {
    console.error("(In PatientCount) Caught error: " + JSON.stringify(err.responseStatus));
  }
  if (!portalConfig) {
    return undefined;
  }

  // Build the query parameters for mriQuery
  const mriQueryBuilder = createPatientCountMriQueryBuilder();
  const mriQuery = mriQueryBuilder.filterDefinition(studyId);

  // Build the api url string with query inputs
  const responseType = "json" as ResponseType;
  const urlWithQuerystring = QueryString({
    url: "api/services/population/json/patientcount",
    queryString: {
      mriquery: JSON.stringify(mriQuery),
    },
    compress: ["mriquery"],
  });

  try {
    const key = "patient.attributes.pcount";
    const req = await request({
      baseURL: MRI_BASE_URL,
      url: urlWithQuerystring,
      responseType,
      method: "GET",
    });
    return req["data"][0][key];
  } catch (err: any) {
    console.error("(In PatientCount) Caught error: " + JSON.stringify(err.statusText));
  }

  return undefined;
}

async function getPublicStudiesPatientCount(studyIds: Array<string>): Promise<any> {
  // Build the query parameters for mriQuery
  const mriQueryBuilder = createPatientCountMriQueryBuilder();
  const mriQuery = mriQueryBuilder.studiesPatientCountDefinition(studyIds);

  // Build the api url string with query inputs
  const responseType = "json" as ResponseType;
  const urlWithQuerystring = QueryString({
    url: "api/services/public/population/studies/patientcount",
    queryString: {
      mriquery: JSON.stringify(mriQuery),
    },
    compress: ["mriquery"],
  });

  try {
    const req = await request({
      baseURL: MRI_BASE_URL,
      url: urlWithQuerystring,
      responseType,
      method: "GET",
    });
    return req;
  } catch (err: any) {
    console.error("(In PatientCount) Caught error: " + JSON.stringify(err.statusText));
  }

  return undefined;
}

async function getStudiesPatientCount(studyIds: Array<string>): Promise<any> {
  // Build the query parameters for mriQuery
  const mriQueryBuilder = createPatientCountMriQueryBuilder();
  const mriQuery = mriQueryBuilder.studiesPatientCountDefinition(studyIds);

  // Build the api url string with query inputs
  const responseType = "json" as ResponseType;
  const urlWithQuerystring = QueryString({
    url: "api/services/population/studies/patientcount",
    queryString: {
      mriquery: JSON.stringify(mriQuery),
    },
    compress: ["mriquery"],
  });

  try {
    const req = await request({
      baseURL: MRI_BASE_URL,
      url: urlWithQuerystring,
      responseType,
      method: "GET",
    });
    return req;
  } catch (err: any) {
    console.error("(In PatientCount) Caught error: " + JSON.stringify(err.statusText));
  }

  return undefined;
}

const mriClient = {
  queryMri,
  getMyConfig,
  getPatientCount,
  getStudyConfig,
  getStudiesPatientCount,
  getPublicStudiesPatientCount,
};

export default mriClient;
