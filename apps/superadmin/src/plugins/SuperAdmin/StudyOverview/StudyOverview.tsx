import React, { FC, useCallback } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import { useQuery } from "@apollo/client";
import {
  Loader,
  TableCell,
  TableRow,
  Text,
  Title,
  VisibilityOffIcon,
  VisibilityOnIcon,
  VisibilityPublicIcon,
} from "@portal/components";
import { Study } from "../../../types";
import { GET_STUDIES_AS_SUPER_ADMIN } from "../../../graphql";
import "./StudyOverview.scss";

const StudyOverview: FC = () => {
  const { loading: loadingStudies, data, error } = useQuery<{ studiesRaw: Study[] }>(GET_STUDIES_AS_SUPER_ADMIN);

  const visibilityImgAlt = useCallback((value: string) => {
    return value === "DEFAULT" ? "Normal" : value.charAt(0).toUpperCase() + value.substring(1).toLowerCase();
  }, []);

  const visibilityIcon = useCallback(
    (visibilityStatus: string) => {
      const alt = visibilityImgAlt(visibilityStatus);
      switch (visibilityStatus) {
        case "HIDDEN":
          return <VisibilityOffIcon title={alt} />;
        case "PUBLIC":
          return <VisibilityPublicIcon title={alt} />;
        default:
          return <VisibilityOnIcon title={alt} />;
      }
    },
    [visibilityImgAlt]
  );

  if (error) console.error(error.message);
  if (loadingStudies) return <Loader />;

  return (
    <div className="studyoverview__container">
      <div className="studyoverview">
        <Title>Dataset overview</Title>
        <div className="studyoverview__content">
          <TableContainer className="studyoverview__list">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="10%">Visibility</TableCell>
                  <TableCell width="12%">System</TableCell>
                  <TableCell width="20%">Study ID</TableCell>
                  <TableCell width="15%">Tenant</TableCell>
                  <TableCell width="10%">Type</TableCell>
                  <TableCell
                    width="10%"
                    style={{
                      wordBreak: "break-word",
                    }}
                  >
                    Token study code
                  </TableCell>
                  <TableCell width="23%">Schema name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(!data?.studiesRaw || data.studiesRaw.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
                {data?.studiesRaw?.map((study: Study, index) => (
                  <TableRow key={study.id} style={index % 2 ? { background: "#ebf1f8" } : { background: "white" }}>
                    <TableCell style={{ paddingLeft: "2.75em" }}>{visibilityIcon(study.visibilityStatus)}</TableCell>
                    <TableCell>{study.studySystem?.name}</TableCell>
                    <TableCell>
                      <Text textWidth="90%" textFormat="wrap" showCopy>
                        {study.id}
                      </Text>
                    </TableCell>
                    <TableCell style={{ maxWidth: "60px" }}>{study.tenant.name}</TableCell>
                    <TableCell>{study.type}</TableCell>
                    <TableCell>{study.tokenStudyCode}</TableCell>
                    <TableCell>
                      <Text textWidth="80%" textFormat="wrap" {...(study.schemaName && { showCopy: true })}>
                        {study.schemaName ? study.schemaName : "-"}
                      </Text>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default StudyOverview;
