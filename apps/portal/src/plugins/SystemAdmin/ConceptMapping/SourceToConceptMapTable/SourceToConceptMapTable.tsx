import React, { FC, useCallback, useContext, useState, useEffect, ChangeEvent, SetStateAction } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Paper,
} from "@mui/material";
import { Loader } from "@portal/components";
import { useFeedback, useTranslation } from "../../../../contexts";
import { api } from "../axios/api";
import { conceptMap } from "../types";
import "./SourceToConceptMapTable.scss";
import { i18nKeys } from "../../../../contexts/app-context/states";

interface SourceToConceptMapTableProps {
  selectedDataset: string;
}

export const SourceToConceptMapTable: FC<SourceToConceptMapTableProps> = ({ selectedDataset }) => {
  const { getText } = useTranslation();
  const { setFeedback, setGenericErrorFeedback } = useFeedback();
  const [loading, setLoading] = useState(false);
  const [sourceToConceptMaps, setSourceToConceptMaps] = useState<conceptMap[]>([]);

  const fetchSourceToConceptMaps = useCallback(async (withLoading = false) => {
    try {
      if (withLoading) setLoading(true);

      const maps = await api.ConceptMapping.getConceptMappings(selectedDataset);
      setSourceToConceptMaps(maps);
    } catch (error: any) {
      if (error.data?.message) {
        setFeedback({ type: "error", message: error.data?.message });
      } else {
        setGenericErrorFeedback();
      }
      console.error("err", error);
    } finally {
      if (withLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSourceToConceptMaps(true);
  }, [fetchSourceToConceptMaps]);

  if (loading) return <Loader />;

  return (
    <div className="source__container">
      <div className="source-to-concept-map-table__table">
        <TableContainer
          component={Paper}
          sx={{ "& .MuiTableCell-root": { color: "#000080" }, maxHeight: 320, width: 1, border: "1px solid #dad7d7" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>{getText(i18nKeys.SOURCE_TO_CONCEPT_MAP_TABLE__SOURCE_CODE)}</TableCell>
                <TableCell>{getText(i18nKeys.SOURCE_TO_CONCEPT_MAP_TABLE__SOURCE_CONCEPT_ID)}</TableCell>
                <TableCell>{getText(i18nKeys.SOURCE_TO_CONCEPT_MAP_TABLE__SOURCE_VOCABULARY_ID)}</TableCell>
                <TableCell>{getText(i18nKeys.SOURCE_TO_CONCEPT_MAP_TABLE__SOURCE_CODE_DESCRIPTION)}</TableCell>
                <TableCell>{getText(i18nKeys.SOURCE_TO_CONCEPT_MAP_TABLE__TARGET_CONCEPT_ID)}</TableCell>
                <TableCell>{getText(i18nKeys.SOURCE_TO_CONCEPT_MAP_TABLE__TARGET_VOCABULARY_ID)}</TableCell>
                <TableCell>{getText(i18nKeys.SOURCE_TO_CONCEPT_MAP_TABLE__VALID_START_DATE)}</TableCell>
                <TableCell>{getText(i18nKeys.SOURCE_TO_CONCEPT_MAP_TABLE__VALID_END_DATE)}</TableCell>
                <TableCell>{getText(i18nKeys.SOURCE_TO_CONCEPT_MAP_TABLE__INVALID_REASON)}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sourceToConceptMaps.map((sourceToConceptMap: conceptMap, index: React.Key) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:nth-of-type(even)": {
                      backgroundColor: "#f8f8f8",
                    },
                  }}
                >
                  {Object.values(sourceToConceptMap).map((data) => (
                    <TableCell key={data}>{data}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
