import React, { FC, useEffect } from "react";
import env from "../../../env";
import { loadScript, loadStyleSheet, loadSapScript } from "../../../utils/loadScript";
import PluginContainer from "./PluginContainer";

interface PAPluginProps {
  tenantId?: string;
  studyId?: string;
  getToken?: () => Promise<string>;
}

const PA_ASSETS_URL = `${env.REACT_APP_DN_BASE_URL}mri/assets.json`;
const VUE_APP_HOST = env.REACT_APP_DN_BASE_URL.endsWith("/")
  ? env.REACT_APP_DN_BASE_URL.slice(0, -1)
  : env.REACT_APP_DN_BASE_URL;
const APPROUTER_ORIGIN = new URL(PA_ASSETS_URL).origin;

const PAPlugin: FC<PAPluginProps> = ({ studyId, getToken }) => {
  const isLocalDev = window.location.hostname === "localhost";

  const addOrigin = (arr: string[]) => {
    return arr.map((path) =>
      path.startsWith("http://") || path.startsWith("https://") ? path : `${APPROUTER_ORIGIN}${path}`
    );
  };

  const hideLogoutButton = () => {
    const logoutButton: HTMLButtonElement | null = document.querySelector('button[id="mriBtnLogout"]');
    if (logoutButton) {
      logoutButton.style.display = "none";
    }
  };

  useEffect(() => {
    let callbacks: (() => void)[] = [];
    fetch(PA_ASSETS_URL)
      .then((response) => response.json())
      .then(({ css, js }) => {
        loadSapScript(() => {
          const styleSheetCallbacks = addOrigin(css).map(loadStyleSheet);
          const scriptCallbacks = addOrigin(js).map(loadScript);
          hideLogoutButton();
          callbacks = [...scriptCallbacks, ...styleSheetCallbacks];
        });
      });
    //Remove scripts and links upon component unmounting
    return () => callbacks.forEach((callback) => callback());
  }, [isLocalDev]);

  return (
    <PluginContainer studyId={studyId} getToken={getToken} qeSvcUrl={VUE_APP_HOST}>
      <div className="vue-main" />
    </PluginContainer>
  );
};

export default PAPlugin;
