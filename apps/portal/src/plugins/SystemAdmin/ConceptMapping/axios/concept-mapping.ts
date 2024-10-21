import request from "../../../../axios/request";
import env from "../../../../env";
import { dataset } from "../types";
const CONCEPT_MAPPING_URL = `${env.REACT_APP_DN_BASE_URL}concept-mapping`;

export class ConceptMapping {
  public getConceptMappings = (dataset: dataset) => {
    return request({
      baseURL: CONCEPT_MAPPING_URL,
      method: "GET",
      params: {
        datasetId: dataset.datasetId,
        dialect: dataset.dialect,
      },
    });
  };

  public saveConceptMappings = (dataset: dataset, sourceVocabularyId: string, conceptMappings: string) => {
    return request({
      baseURL: CONCEPT_MAPPING_URL,
      method: "POST",
      params: {
        datasetId: dataset.datasetId,
        dialect: dataset.dialect,
      },
      data: {
        sourceVocabularyId: sourceVocabularyId,
        conceptMappings: conceptMappings,
      },
    });
  };
}
