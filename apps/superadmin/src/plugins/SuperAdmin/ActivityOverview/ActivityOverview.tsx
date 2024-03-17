import React, { FC, Fragment } from "react";
import { useQuery } from "@apollo/client";
import { Loader, TableCell, TableRow, Title } from "@portal/components";
import { GET_LOGS } from "../../../graphql";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import { PageProps, SuperAdminPageMetadata } from "@portal/plugin";
import dayjs from "dayjs";
import "./ActivityOverview.scss";

interface ActivityOverviewProps extends PageProps<SuperAdminPageMetadata> {}

interface Log {
  commandType: string;
  description: string;
  id: string;
  userId: string;
  system: string;
  createdDate: Date;
  userEmail: string;
}

export const ActivityOverview: FC<ActivityOverviewProps> = () => {
  const { loading, data, error } = useQuery<{ logs: Log[] }>(GET_LOGS);

  if (error) console.error(error.message);
  if (loading) return <Loader />;

  return (
    <div className="activityoverview">
      <Title>Activity Overview</Title>
      <div className="activityoverview__actions">
        <h3 className="activityoverview__actions-title">Activity log</h3>
      </div>
      <div className="activityoverview__content">
        <TableContainer className="activityoverview__list">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "15%" }}>Date and Time</TableCell>
                <TableCell style={{ width: "10%" }}>Log ID</TableCell>
                <TableCell style={{ width: "20%" }}>User email</TableCell>
                <TableCell style={{ width: "10%" }}>System</TableCell>
                <TableCell style={{ width: "15%" }}>Command type</TableCell>
                <TableCell style={{ width: "30%" }}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!data?.logs || data.logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {data?.logs.map((log: Log, index) => (
                    <Fragment key={index}>
                      <TableRow
                        className="activityoverview__rows"
                        style={index % 2 ? { background: "#ebf1f8" } : { background: "white" }}
                      >
                        <TableCell>{dayjs(log.createdDate).format("DD.MM.YYYY (ddd) HH:mm:ss")}</TableCell>
                        <TableCell>{log.id}</TableCell>
                        <TableCell>{log.userEmail ? log.userEmail : log.userId}</TableCell>
                        <TableCell>{log.system}</TableCell>
                        <TableCell className="command-type">{log.commandType}</TableCell>
                        <TableCell>{log.description}</TableCell>
                      </TableRow>
                    </Fragment>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
