import React, { FC, useEffect } from "react";
import env from "../../../../env";
import { loadStyleSheet, loadEsModuleScript } from "../../../../utils/loadScript";
import { getAuthToken } from "../../../../containers/auth";
import "./JobsViewer.scss";

const LOG_VIEWER_ASSETS_URL = "jobs/assets.json";
const APPROUTER_ORIGIN = new URL(LOG_VIEWER_ASSETS_URL).origin;

const JobsViewer: FC<{
  setJobsViewerScriptsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  setJobsViewerDivLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setJobsViewerScriptsLoaded, setJobsViewerDivLoaded }) => {
  const isLocalDev = window.location.hostname === "localhost";

  const addOrigin = (arr: string[]) => {
    return arr.map((path) =>
      path.startsWith("http://") || path.startsWith("https://") ? `jobs/${path}` : `${APPROUTER_ORIGIN}/jobs/${path}`
    );
  };
  useEffect(() => {
    let callbacks: (() => void)[] = [];
    fetch(LOG_VIEWER_ASSETS_URL)
      .then((response) => response.json())
      .then(({ css, js }): void => {
        const styleSheetCallbacks = addOrigin(css).map((url) => loadStyleSheet(url));
        const scriptCallbacks = addOrigin(js).map((url) =>
          loadEsModuleScript(url, () => {
            setJobsViewerScriptsLoaded(true);
          })
        );
        callbacks = [...scriptCallbacks, ...styleSheetCallbacks];
      });
    // Remove scripts and links upon component unmounting
    return () => callbacks.forEach((callback) => callback());
  }, [isLocalDev, setJobsViewerScriptsLoaded]);
  const browserBaseUrl = `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? ":" + window.location.port : ""
  }/portal/systemadmin/jobs`;
  return (
    <div
      className="jobs"
      id="jobs-main"
      ref={(node: any) => {
        if (node) {
          setJobsViewerDivLoaded(true);
          node.portalAPI = {
            getAuthToken,
            browserBaseUrl,
          };
        }
      }}
    />
  );
};

export default JobsViewer;
