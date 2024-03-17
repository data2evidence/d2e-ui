import React, { FC, Fragment, useState, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { Loader, TableCell, TableRow, Title, IconButton, SettingsGearIcon } from "@portal/components";
import { GET_ALL_SYSTEM_APPS } from "../../../graphql";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import { PageProps, SuperAdminPageMetadata } from "@portal/plugin";
import "./SystemOverviewPlugin.scss";
import SystemSettingsDialog from "./SystemSettingsDialog/SystemSettingsDialog";

interface SystemOverviewProps extends PageProps<SuperAdminPageMetadata> {}

interface AppInfo {
  name: string;
  url: string;
}
export interface SystemInfo {
  apps: AppInfo[];
  host: string;
  systemId: string;
  system: string;
  ad: string;
}

export const SystemOverview: FC<SystemOverviewProps> = () => {
  const { loading, data, error } = useQuery<{ allSystemApps: SystemInfo[] }>(GET_ALL_SYSTEM_APPS);
  const [activeSystem, setActiveSystem] = useState<SystemInfo | undefined>();
  const [showSystemSettings, setShowSystemSettings] = useState(false);

  const handleSettings = useCallback((system: SystemInfo) => {
    setShowSystemSettings(true);
    setActiveSystem(system);
  }, []);

  const closeSettings = useCallback(() => {
    setShowSystemSettings(false);
    setActiveSystem(undefined);
  }, []);

  if (error) console.error(error.message);
  if (loading) return <Loader />;

  return (
    <div className="systemoverviewplugin">
      <Title>System Overview</Title>
      <div className="systemoverviewplugin__actions">
        <h3 className="systemoverviewplugin__actions-title">System Overview</h3>
      </div>
      <div className="systemoverviewplugin__content">
        <TableContainer className="systemoverviewplugin__list">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>System</TableCell>
                <TableCell>Hostname</TableCell>
                <TableCell>AD</TableCell>
                <TableCell>Apps</TableCell>
                <TableCell>Urls</TableCell>
                <TableCell>Settings</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!data?.allSystemApps || data.allSystemApps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {data?.allSystemApps.map((info: SystemInfo, index) => (
                    <Fragment key={index}>
                      <TableRow
                        key={info.system}
                        className="systemoverviewplugin__rows"
                        style={index % 2 ? { background: "#ebf1f8" } : { background: "white" }}
                      >
                        <TableCell rowSpan={info.apps.length + 1}>
                          <div key={info.systemId}>{info.systemId}</div>
                          <br />
                          <div key={info.system}>{info.system}</div>
                        </TableCell>
                        <TableCell rowSpan={info.apps.length + 1}>
                          <div key={info.host}>{info.host}</div>
                        </TableCell>
                        <TableCell rowSpan={info.apps.length + 1}>
                          <div key={info.ad}>{info.ad}</div>
                        </TableCell>
                      </TableRow>
                      {info.apps.map((app: AppInfo, infoIndex) => (
                        <TableRow
                          key={app.name}
                          className="systemoverviewplugin__subrows"
                          style={index % 2 ? { background: "#ebf1f8" } : { background: "white" }}
                        >
                          <TableCell>{app.name}</TableCell>
                          <TableCell>{app.url}</TableCell>
                          {infoIndex === 0 && (
                            <TableCell className="col-action" rowSpan={info.apps.length + 1}>
                              <div className="table-button-container">
                                <IconButton
                                  startIcon={<SettingsGearIcon />}
                                  title="Settings"
                                  onClick={() => handleSettings(info)}
                                />
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </Fragment>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {showSystemSettings && (
          <SystemSettingsDialog system={activeSystem} open={showSystemSettings} onClose={closeSettings} />
        )}
      </div>
    </div>
  );
};
