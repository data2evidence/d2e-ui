import React, { FC, useEffect, useState } from "react";
import { Table, TableBody, TableHead } from "@mui/material";
import { TableRow, TableCell, Loader } from "@portal/components";
import { useFeedback, useTranslation } from "../../../../../contexts";
import { TerminologyDetailsList } from "../../utils/types";
import { Terminology } from "../../../../../axios/terminology";
import "./TerminologyDetail.scss";

interface TerminologyDetailProps {
  userId?: string;
  conceptId: number;
  datasetId?: string;
}

const TerminologyDetail: FC<TerminologyDetailProps> = ({ userId, conceptId, datasetId }) => {
  const { getText, i18nKeys } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TerminologyDetailsList | null>();
  const { setFeedback } = useFeedback();

  useEffect(() => {
    if (userId && datasetId) {
      setIsLoading(true);
      const fetchData = async () => {
        if (userId) {
          try {
            const terminologyApi = new Terminology();
            const fhirResponse = await terminologyApi.getTerminologyConnections(conceptId, datasetId);
            const response: TerminologyDetailsList = {
              details: fhirResponse.group[0]?.element?.[0]?.valueSet.expansion.contains[0],
              connections: [],
            };
            for (const item of fhirResponse.group) {
              response.connections.push(...item.element[0].target);
            }
            setData(response);
          } catch (e) {
            console.error(e);
            setFeedback({
              type: "error",
              message: getText(i18nKeys.TERMINOLOGY_DETAIL__ERROR),
              description: getText(i18nKeys.TERMINOLOGY_DETAIL__ERROR_DESCRIPTION),
            });
          } finally {
            setIsLoading(false);
          }
        }
      };
      fetchData();
    }
  }, [userId, conceptId, setData, setFeedback, datasetId, getText]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="terminology_detail__container" style={{ visibility: data ? "inherit" : "hidden", height: "100%" }}>
      <div
        style={{
          border: "1px solid #d4d4d4",
          visibility: data ? "inherit" : "hidden",
          overflow: "auto",
          width: "60%",
        }}
      >
        <div className="terminology_detail__table-connections">
          <Table size="small" stickyHeader sx={{ "& .MuiTableCell-root": { color: "#000080" } }}>
            <TableHead>
              <TableRow>
                <TableCell width="20%">{getText(i18nKeys.TERMINOLOGY_DETAIL__RELATIONSHIP)}</TableCell>
                <TableCell width="40%">{getText(i18nKeys.TERMINOLOGY_DETAIL__RELATES_TO)}</TableCell>
                <TableCell width="20%">{getText(i18nKeys.TERMINOLOGY_DETAIL__CONCEPT_ID)}</TableCell>
                <TableCell width="20%">{getText(i18nKeys.TERMINOLOGY_DETAIL__VOCABULARY)}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                "& .MuiTableRow-root:nth-of-type(even)": {
                  backgroundColor: "transparent",
                },
              }}
            >
              {data &&
                data?.connections.length > 0 &&
                data.connections.map((conn, index) => (
                  <TableRow key={conn.code + index}>
                    <TableCell>{conn.equivalence}</TableCell>
                    <TableCell>{conn.display}</TableCell>
                    <TableCell>{conn.code}</TableCell>
                    <TableCell>{conn.vocabularyId}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div style={{ border: "1px solid #d4d4d4", flex: 1, marginLeft: 15, overflow: "auto" }}>
        <div className="terminology_detail__table-details">
          {data && data?.connections.length > 0 && (
            <Table size="small" sx={{ "& .MuiTableCell-root": { color: "#000080" } }} stickyHeader>
              <TableBody
                sx={{
                  "& .MuiTableRow-root:nth-of-type(even)": {
                    backgroundColor: "transparent",
                  },
                  "& .MuiTableCell-root:nth-of-type(odd)": { fontWeight: 500 },
                }}
              >
                <TableRow>
                  <TableCell variant="head" colSpan={5}>
                    {getText(i18nKeys.TERMINOLOGY_DETAIL__DETAILS)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width="40%">{getText(i18nKeys.TERMINOLOGY_DETAIL__DOMAIN_ID)}</TableCell>
                  <TableCell>{data?.details?.domainId ?? ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width="40%">{getText(i18nKeys.TERMINOLOGY_DETAIL__CONCEPT_CLASS_ID)}</TableCell>
                  <TableCell>{data?.details?.conceptClassId ?? ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width="40%">{getText(i18nKeys.TERMINOLOGY_DETAIL__VOCABULARY_ID)}</TableCell>
                  <TableCell>
                    <div>{data?.details?.system ?? ""}</div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width="40%">{getText(i18nKeys.TERMINOLOGY_DETAIL__CONCEPT_ID)}</TableCell>
                  <TableCell>{data?.details?.conceptId ?? ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width="40%">{getText(i18nKeys.TERMINOLOGY_DETAIL__CONCEPT_CODE)}</TableCell>
                  <TableCell>{data?.details?.code ?? ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width="40%">{getText(i18nKeys.TERMINOLOGY_DETAIL__VALIDITY)}</TableCell>
                  <TableCell>{data?.details?.validity ?? ""}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TerminologyDetail;