import env from "../env";
import request from "./request";
import {
  ConceptSet,
  ConceptSetWithConceptDetails,
  FhirConceptMap,
  FhirValueSet,
  FilterOptions,
  HybridSearchConfig,
  Concept,
  ConceptHierarchyResponse,
  FirstConcepts,
} from "../plugins/Researcher/Terminology/utils/types";

import { rowObject } from "../plugins/SystemAdmin/ConceptMapping/types";

const TERMINOLOGY_BASE_URL = `${env.REACT_APP_DN_BASE_URL}terminology`;

export class Terminology {
  public getTerminologies(
    page: number,
    rowsPerPage: number,
    datasetId: string,
    searchText: string,
    conceptClassId: string[],
    domainId: string[],
    vocabularyId: string[],
    standardConcept: string[],
    validity: string[]
  ): Promise<FhirValueSet> {
    const offset = page * rowsPerPage;

    const params = new URLSearchParams();
    params.append("datasetId", String(datasetId));
    params.append("offset", String(offset));
    params.append("count", String(rowsPerPage));
    params.append("code", String(searchText));
    params.append("filter", JSON.stringify({ conceptClassId, domainId, vocabularyId, standardConcept, validity }));

    return request({
      baseURL: TERMINOLOGY_BASE_URL,
      url: `/fhir/4_0_0/valueset/$expand?${params}`,
      method: "GET",
    });
  }
  public getTerminologyByBatch(datasetId: string, searchText: string[], domainId: string[]): Promise<FhirValueSet> {
    const standardConcept = ["S"];
    const params = new URLSearchParams();
    params.append("datasetId", String(datasetId));
    params.append("offset", "0");
    params.append("count", "1");
    params.append("filter", JSON.stringify({ domainId, standardConcept }));
    searchText.forEach((text) => params.append("code", String(text)));

    return request({
      baseURL: TERMINOLOGY_BASE_URL,
      url: `/fhir/4_0_0/valueset/$expand?${params}`,
      method: "GET",
    });
  }

  public getFirstConcepts(data: rowObject[], datasetId: string): Promise<FirstConcepts[]> {
    return request({
      baseURL: TERMINOLOGY_BASE_URL,
      url: `/fhir/4_0_0/concepts`,
      method: "POST",
      data: { data, datasetId },
    });
  }

  public getTerminologyConnections(conceptId: number, datasetId: string): Promise<FhirConceptMap> {
    return request({
      baseURL: TERMINOLOGY_BASE_URL,
      url: `fhir/4_0_0/conceptmap/$translate?conceptId=${conceptId}&datasetId=${datasetId}`,
      method: "GET",
    });
  }

  public getRecommendedConcepts(conceptIds: number[], datasetId: string) {
    return request<Concept[]>({
      baseURL: TERMINOLOGY_BASE_URL,
      url: `/concept/recommended/list`,
      method: "POST",
      data: {
        conceptIds,
        datasetId,
      },
    });
  }

  public async getFilterOptions(
    datasetId: string,
    searchText: string,
    conceptClassId: string[],
    domainId: string[],
    vocabularyId: string[],
    standardConcept: string[]
  ): Promise<FilterOptions> {
    const params = new URLSearchParams();
    params.append("datasetId", datasetId);
    params.append("searchText", searchText);
    params.append("filter", JSON.stringify({ conceptClassId, domainId, vocabularyId, standardConcept }));

    const { filterOptions } = await request<{ filterOptions: FilterOptions }>({
      baseURL: TERMINOLOGY_BASE_URL,
      url: `/concept/filter-options?${params}`,
      method: "GET",
    });
    return filterOptions;
  }

  public async getConceptHierarchy(
    datasetId: string,
    conceptId: number,
    depth: number
  ): Promise<ConceptHierarchyResponse> {
    return await request({
      baseURL: TERMINOLOGY_BASE_URL,
      url: `concept/hierarchy?datasetId=${datasetId}&conceptId=${conceptId}&depth=${depth}`,
      method: "GET",
    });
  }

  // CONCEPT SETS

  public getConceptSets() {
    return request<ConceptSetWithConceptDetails[]>({
      baseURL: TERMINOLOGY_BASE_URL,
      url: `/concept-set`,
      method: "GET",
    });
  }

  public getConceptSet(conceptSetId: string, datasetId: string) {
    return request<ConceptSetWithConceptDetails>({
      baseURL: TERMINOLOGY_BASE_URL,
      url: `/concept-set/${conceptSetId}?datasetId=${datasetId}`,
      method: "GET",
    });
  }

  public removeConceptSet(conceptSetId: string) {
    return request<string>({
      baseURL: TERMINOLOGY_BASE_URL,
      url: `/concept-set/${conceptSetId}`,
      method: "DELETE",
    });
  }

  public createConceptSet(conceptSet: Omit<ConceptSet, "id">) {
    return request<string>({
      baseURL: TERMINOLOGY_BASE_URL,
      url: `/concept-set`,
      method: "POST",
      data: conceptSet,
    });
  }

  public updateConceptSet(conceptSetId: string, conceptSet: Partial<ConceptSet>) {
    return request<string | { statusCode: number }>({
      baseURL: TERMINOLOGY_BASE_URL,
      url: `/concept-set/${conceptSetId}`,
      method: "PUT",
      data: conceptSet,
    });
  }

  // Hybrid Search
  public getHybridSearchConfig() {
    return request<HybridSearchConfig>({
      baseURL: TERMINOLOGY_BASE_URL,
      url: `/hybrid-search-config`,
      method: "GET",
    });
  }

  public updateHybridSearchConfig(config: HybridSearchConfig) {
    return request<HybridSearchConfig>({
      baseURL: TERMINOLOGY_BASE_URL,
      url: `/hybrid-search-config`,
      method: "POST",
      data: config,
    });
  }
}

export const terminologyApi = new Terminology();
