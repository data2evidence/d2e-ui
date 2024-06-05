import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorBoundary, IconButton, Title } from "@portal/components";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import classNames from "classnames";
import { SetupMenuItem } from "./SetupMenuItem/SetupMenuItem";
import { loadPlugins } from "../../utils";
import { IPluginItem, LocationState } from "../../types";
import { SetupPluginRenderer } from "../core/SetupPluginRenderer";
import "./SetupOverview.scss";
import { useTranslation } from "../../contexts";
import { useDialogHelper } from "../../hooks";
import TriggerUploadDialog from "./PluginMenuItem/TriggerUploadDialog/TriggerUploadDialog";
import { PluginMenuItem } from "./PluginMenuItem/PluginMenuItem";
import { api } from "../../axios/api";

const plugins = loadPlugins();

export const SetupOverview: FC = () => {
  const { getText, i18nKeys } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  const [showTriggerUploadDialog, openTriggerUploadDialog, closeTriggerUploadDialog] = useDialogHelper(false);
  const [uploadActive, setUploadActive] = useState(false);
  const enabledPlugins = useMemo(() => plugins.setup?.filter((plugin: IPluginItem) => plugin.enabled) || [], []);
  const state = useMemo(() => locationState || { state: { tab: "setup", subTab: null } }, [locationState]);

  const fetchUploadStatus = useCallback(async () => {
    const res = await api.dataflow.getPluginUploadStatus();
    console.log(`res status: ${res.noActiveInstallations}`);
    console.log(JSON.stringify(res));
    if (res.noActiveInstallations === false) {
      setUploadActive(true);
    } else {
      setUploadActive(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchUploadStatus();

    // Set up interval to fetch status every 10 seconds
    const intervalId = setInterval(fetchUploadStatus, 10000);

    // Clear interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchUploadStatus]);

  const handleOpenPlugin = useCallback(
    (plugin: IPluginItem) => {
      navigate(location.pathname, {
        state: {
          tab: "setup",
          subTab: plugin.route,
        },
      });
    },
    [navigate, location]
  );

  const handleBack = useCallback(() => {
    navigate(location.pathname, {
      state: {
        tab: "setup",
        subTab: "",
      },
    });
  }, [navigate, location]);

  return (
    <div className="setup-overview">
      {state.subTab && (
        <div className="setup-overview__back-header">
          <IconButton startIcon={<ArrowBackIcon />} onClick={handleBack} />
          <div>{getText(i18nKeys.SETUP_OVERVIEW__BACK)}</div>
        </div>
      )}
      <div className={classNames("setup-overview__wrapper", { "setup-overview__plugin": Boolean(state.subTab) })}>
        {!state.subTab && (
          <>
            <div className="setup-overview__header">
              <Title>{getText(i18nKeys.SETUP_OVERVIEW__SETUP)}</Title>
            </div>
            <div className="setup-overview__list">
              {enabledPlugins.map((plugin: IPluginItem) => {
                return (
                  <SetupMenuItem
                    key={plugin.route}
                    name={plugin.name}
                    description={plugin.description}
                    notes={plugin.notes}
                    onClick={() => handleOpenPlugin(plugin)}
                  />
                );
              })}
              <PluginMenuItem
                key={`default-plugin`}
                name={`Plugins`}
                description={`Trigger default plugins installation`}
                notes={`Installing: ${uploadActive}`}
                onClick={() => openTriggerUploadDialog()}
              />
            </div>
          </>
        )}
        {state.subTab && (
          <div className="setup-overview__plugin-content">
            {enabledPlugins.map(
              (plugin: IPluginItem) =>
                state.subTab === plugin.route && (
                  <ErrorBoundary name={plugin.name} key={plugin.route}>
                    <SetupPluginRenderer path={plugin.pluginPath} data={plugin.data} />
                  </ErrorBoundary>
                )
            )}
          </div>
        )}
        <TriggerUploadDialog open={showTriggerUploadDialog} onClose={closeTriggerUploadDialog} />
      </div>
    </div>
  );
};
