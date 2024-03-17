import React, { FC, useCallback, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import { useQuery } from "@apollo/client";
import { IconButton, Loader, SettingsGearIcon, TableCell, TableRow, Text, Title } from "@portal/components";
import { Tenant } from "../../../types";
import { GET_TENANTS } from "../../../graphql";
import { useMsalInfo } from "../../../contexts/MsalContext";
import TenantSettingsDialog from "./TenantSettingsDialog/TenantSettingsDialog";
import "./TenantOverview.scss";

const TenantOverview: FC = () => {
  const { getSuperUserInfo } = useMsalInfo();
  const userInfo = getSuperUserInfo();
  const { loading, data, error } = useQuery<{ tenants: Tenant[] }>(GET_TENANTS);
  const [activeTenant, setActiveTenant] = useState<Tenant | undefined>();
  const [showTenantSettings, setShowTenantSettings] = useState(false);

  const handleSettings = useCallback((tenant: Tenant) => {
    setShowTenantSettings(true);
    setActiveTenant(tenant);
  }, []);

  const closeSettings = useCallback(() => {
    setShowTenantSettings(false);
    setActiveTenant(undefined);
  }, []);

  const buttonColWidth = "13%"; // 1 button "Setting" role

  const tenantIdWidth = "34%";

  const tenantNameWidth = "33%";

  const systemWidth = "20%";

  if (error) console.error(error.message);
  if (loading) return <Loader />;

  return (
    <div className="tenants__container">
      <div className="tenants">
        <Title>Tenant overview</Title>
        <div className="tenants__content">
          <TableContainer className="tenants__list">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={tenantIdWidth}>Tenant ID</TableCell>
                  <TableCell width={tenantNameWidth}>Tenant name</TableCell>
                  <TableCell width={systemWidth}>System</TableCell>
                  <TableCell width={buttonColWidth}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(!data?.tenants || data.tenants.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
                {data?.tenants?.map((tenant, index) => (
                  <TableRow key={tenant.id} style={index % 2 ? { background: "#ebf1f8" } : { background: "white" }}>
                    <TableCell>
                      <Text textWidth="305px" textFormat="wrap" showCopy buttonStyle={{ paddingLeft: "17px" }}>
                        {tenant.id}
                      </Text>
                    </TableCell>
                    <TableCell>{tenant.name}</TableCell>
                    <TableCell>{tenant.system}</TableCell>
                    <TableCell className="col-action">
                      <div className="table-button-container">
                        {(userInfo.isAlpOwner || userInfo.isAlpAdmin) && (
                          <IconButton
                            startIcon={<SettingsGearIcon />}
                            title="Settings"
                            onClick={() => handleSettings(tenant)}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {showTenantSettings && (
            <TenantSettingsDialog tenant={activeTenant} open={showTenantSettings} onClose={closeSettings} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantOverview;
