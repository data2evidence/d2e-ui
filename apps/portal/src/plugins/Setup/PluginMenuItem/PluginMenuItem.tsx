import React, { FC, useState, useCallback, useEffect } from "react";
import { Button } from "@portal/components";
import "./PluginMenuItem.scss";
import { useTranslation } from "../../../contexts";
import { useDialogHelper } from "../../../hooks";
import { i18nKeys } from "../../../contexts/app-context/states";
import TriggerUploadDialog from "./TriggerUploadDialog/TriggerUploadDialog";
import { api } from "../../../axios/api";

export const PluginMenuItem: FC = () => {
  const { getText } = useTranslation();
  const [showTriggerUploadDialog, openTriggerUploadDialog, closeTriggerUploadDialog] = useDialogHelper(false);
  const [pluginInstallationStatus, setPluginInstallationStatus] = useState("");

  const fetchUploadStatus = useCallback(async () => {
    const res = await api.dataflow.getPluginUploadStatus();
    setPluginInstallationStatus(res.installationStatus);
  }, []);

  const handleStatusUpdate = (status: string) => {
    setPluginInstallationStatus(status);
  };

  useEffect(() => {
    fetchUploadStatus();
  }, [fetchUploadStatus]);

  const handleCloseDialog = useCallback(() => {
    closeTriggerUploadDialog();
    fetchUploadStatus(); // Fetch status again when dialog closed
  }, [fetchUploadStatus, closeTriggerUploadDialog]);

  return (
    <>
      <div className="plugin-menu-item">
        <div className="plugin-menu-item__info">
          <div className="plugin-menu-item__title">{getText(i18nKeys.PLUGIN_MENU_ITEM__TITLE)}</div>
          {<div className="plugin-menu-item__description">{getText(i18nKeys.PLUGIN_MENU_ITEM__DESCRIPTION)}</div>}
          {
            <div className="plugin-menu-item__notes">{`${getText(
              i18nKeys.PLUGIN_MENU_ITEM__STATUS
            )}: ${pluginInstallationStatus}`}</div>
          }
        </div>
        <div className="plugin-menu-item__action">
          <Button text={getText(i18nKeys.PLUGIN_MENU_ITEM__INSTALL)} onClick={openTriggerUploadDialog} />
        </div>
      </div>
      <TriggerUploadDialog
        open={showTriggerUploadDialog}
        onClose={handleCloseDialog}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
};
