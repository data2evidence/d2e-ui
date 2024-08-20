import React, { useCallback, useContext, useEffect } from "react";
import { ConceptMappingContext, ConceptMappingDispatchContext } from "../Context/ConceptMappingContext";
import { conceptDataType } from "../types";
import { TerminologyProps } from "../../../Researcher/Terminology/Terminology";

const MappingDrawer = ({ selectedDatasetId }: { selectedDatasetId: string }) => {
  const dispatch: React.Dispatch<any> = useContext(ConceptMappingDispatchContext);
  const conceptMappingState = useContext(ConceptMappingContext);
  const selectedData = conceptMappingState.selectedData;
  const { sourceName, domainId } = conceptMappingState.columnMapping;

  // get data from terminology
  // passes data to reducer to update list
  const handleTerminologySelect = useCallback(
    (conceptData: conceptDataType) => {
      dispatch({
        type: "UPDATE_CSV_DATA",
        data: {
          conceptId: conceptData.conceptId,
          conceptName: conceptData.conceptName,
          domainId: conceptData.domainId,
        },
      });
      dispatch({ type: "CLEAR_SELECTED_DATA" });
    },
    [dispatch]
  );

  const getDefaultFilters = useCallback(() => {
    if (domainId) {
      return [
        { id: "concept", value: ["Standard"] },
        { id: "domainId", value: [selectedData[domainId]] },
      ];
    } else {
      return [{ id: "concept", value: ["Standard"] }];
    }
  }, [domainId, selectedData]);

  useEffect(() => {
    if (Object.keys(selectedData).length > 0) {
      const event = new CustomEvent<{ props: TerminologyProps }>("alp-terminology-open", {
        detail: {
          props: {
            onConceptIdSelect: handleTerminologySelect,
            onClose: () => dispatch({ type: "CLEAR_SELECTED_DATA" }),
            initialInput: selectedData[sourceName],
            mode: "CONCEPT_MAPPING",
            selectedDatasetId,
            defaultFilters: getDefaultFilters(),
          },
        },
      });
      window.dispatchEvent(event);
    }
  }, [selectedData, sourceName]);

  return null;
};

export default MappingDrawer;