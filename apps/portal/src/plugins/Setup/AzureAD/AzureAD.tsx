import React, { FC, useCallback, useEffect, useState } from "react";
import { Box, Button, Loader, TextField, Title } from "@portal/components";
import { useAzureAdConfigs } from "../../../hooks";
import { api } from "../../../axios/api";
import "./AzureAD.scss";

interface FormData {
  tenantViewerGroupId: string;
  systemAdminGroupId: string;
  userAdminGroupId: string;
}

const EMPTY_FORM_DATA: FormData = {
  tenantViewerGroupId: "",
  systemAdminGroupId: "",
  userAdminGroupId: "",
};

export const AzureAD: FC = () => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);
  const [saving, setSaving] = useState(false);
  const [configs, loading, error] = useAzureAdConfigs();

  useEffect(() => {
    if (configs) {
      const saved: FormData = {
        tenantViewerGroupId: configs.find((c) => c.code === "ROLE_TENANT_VIEWER_GROUP_ID")?.value || "",
        systemAdminGroupId: configs.find((c) => c.code === "ROLE_SYSTEM_ADMIN_GROUP_ID")?.value || "",
        userAdminGroupId: configs.find((c) => c.code === "ROLE_USER_ADMIN_GROUP_ID")?.value || "",
      };
      setFormData(saved);
    } else {
      setFormData(EMPTY_FORM_DATA);
    }
  }, [configs]);

  const handleFormDataChange = useCallback((updates: { [field: string]: any }) => {
    setFormData((formData) => ({ ...formData, ...updates }));
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      await api.userMgmt.setupAzureAd(formData);
    } finally {
      setSaving(false);
    }
  }, [formData]);

  if (error) console.error(error.message);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="azure-ad">
          <div className="azure-ad__header">
            <Title>Azure AD integration</Title>
          </div>
          <div className="azure-ad__content">
            <Box mb={4}>
              <TextField
                label="Azure Group ID for Tenant Viewer"
                variant="standard"
                sx={{ width: "100%" }}
                value={formData.tenantViewerGroupId}
                onChange={(event) => handleFormDataChange({ tenantViewerGroupId: event.target?.value })}
              />
            </Box>
            <Box mb={4}>
              <TextField
                label="Azure Group ID for System Admin"
                variant="standard"
                sx={{ width: "100%" }}
                value={formData.systemAdminGroupId}
                onChange={(event) => handleFormDataChange({ systemAdminGroupId: event.target?.value })}
              />
            </Box>
            <Box mb={4}>
              <TextField
                label="Azure Group ID for User Admin"
                variant="standard"
                sx={{ width: "100%" }}
                value={formData.userAdminGroupId}
                onChange={(event) => handleFormDataChange({ userAdminGroupId: event.target?.value })}
              />
            </Box>
          </div>
          <div className="azure-ad__footer">
            <Box display="flex" gap={1} className="azure-ad__footer-actions">
              <Button text="Save" onClick={handleSave} loading={saving} />
            </Box>
          </div>
        </div>
      )}
    </>
  );
};
