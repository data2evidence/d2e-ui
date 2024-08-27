import React, { FC, useState, useEffect } from "react";
import LogViewer from "./LogViewer/LogViewer";

const Jobs: FC = () => {
  const [logViewerScriptsLoaded, setLogViewerScriptsLoaded] = useState(false);
  const [logViewerDivLoaded, setLogViewerDivLoaded] = useState(false);

  useEffect(() => {
    if (logViewerScriptsLoaded && logViewerDivLoaded) {
      if (typeof (window as any)?.mountLogViewer !== "function") {
        setLogViewerScriptsLoaded(false);
      } else {
        console.log("mounting...", typeof (window as any)?.mountLogViewer);
        (window as any).mountLogViewer();
      }
    }
  }, [logViewerScriptsLoaded, logViewerDivLoaded]);

  return (
    <LogViewer setLogViewerScriptsLoaded={setLogViewerScriptsLoaded} setLogViewerDivLoaded={setLogViewerDivLoaded} />
  );
};

export default Jobs;
