import React, { FC, useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SuperAdminPlugins } from "../SuperAdmin";
import ConfigurationMenu from "./ConfigurationMenu/ConfigurationMenu";
import { SuperAdminPluginRenderer } from "../../../plugins/core/SuperAdminPluginRenderer";
import { ErrorBoundary } from "@portal/components";
import "./Configuration.scss";

interface LocationState {
  tab: string;
}

const Configuration: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;

  const [activeTab, setActiveTab] = useState(locationState?.tab || SuperAdminPlugins[0]?.route);

  useEffect(() => {
    if (locationState == undefined) {
      setActiveTab(SuperAdminPlugins[0]?.route);
    } else {
      setActiveTab(locationState.tab);
    }
    window.scrollTo(0, 0);
  }, [locationState]);

  const handleTabChange = useCallback(
    (value: string): void => {
      setActiveTab(value);
      navigate(location.pathname, {
        state: {
          tab: value,
        },
      });
    },
    [setActiveTab, navigate, location.pathname]
  );

  return (
    <div className="configuration__container">
      <div className="configuration__menu">
        <ConfigurationMenu activeTab={activeTab} handleTabChange={handleTabChange} />
      </div>
      <div className="configuration__content">
        <div className="tab__content">
          {SuperAdminPlugins.map(
            (item: any) =>
              activeTab === item.route && (
                <ErrorBoundary key={item.route} name={item.name}>
                  <SuperAdminPluginRenderer key={item.route} path={item.pluginPath} />
                </ErrorBoundary>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Configuration;
